import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale, SaleDocument } from '../schema/sale.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateOrderDto } from '../dto/create-sales.dto';
import { UpdateOrderDto } from '../dto/update-sales.dto';
import { CustomError } from 'src/utils/custom-error';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';
import ExcelJS from 'exceljs';
import nm, { Transporter } from 'nodemailer';

import {
  ExportQueryParamsDto,
  GetSalesQueryDto,
  GetSalesReportDto,
} from '../dto/get-sales.dto';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventory/schema/inventory.schema';
import PDFDocument from 'pdfkit';
import type { Response } from 'express';

@Injectable()
export class SalesService {
  private transporter: Transporter;

  constructor(
    @InjectModel(Sale.name) private _salesModel: Model<SaleDocument>,
    @InjectModel(Inventory.name)
    private _inventoryModel: Model<InventoryDocument>,
  ) {
    this.transporter = nm.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
  }

  async create(dto: CreateOrderDto) {
    await Promise.all(
      dto.items.map((item) => {
        const quantityToDecrease = item.quantity;
        return this._inventoryModel
          .findByIdAndUpdate(item._id, {
            $inc: { quantity: -quantityToDecrease },
          })
          .exec();
      }),
    );

    return await this._salesModel.create(dto);
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this._salesModel.findByIdAndUpdate(id, dto);
    if (!updated)
      throw new CustomError(
        ERROR_MESSAGES.ORDER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
  }

  async get(dto: GetSalesQueryDto) {
    const { limit, page } = dto;
    const skip = (page - 1) * limit;

    const [sales, count] = await Promise.all([
      this._salesModel
        .find({ userId: (dto as any).userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._salesModel.countDocuments({ userId: (dto as any).userId }),
    ]);

    return {
      data: sales,
      total: count,
    };
  }

  async generateSalesReport(dto: GetSalesReportDto) {
    const { limit, from, page, to } = dto;
    const skip = (page - 1) * limit;

    const [sales, count] = await Promise.all([
      this._salesModel
        .find({ date: { $gte: from, $lte: to }, userId: (dto as any).userId })
        .skip(skip)
        .limit(limit),
      this._salesModel.countDocuments({
        date: { $gte: from, $lte: to },
        userId: (dto as any).userId,
      }),
    ]);

    return {
      data: sales,
      total: count,
    };
  }

  async generateCustomerLedger(customerName: string, dto: GetSalesQueryDto) {
    console.log(customerName, dto.limit);
    const { limit, page } = dto;
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      this._salesModel.find({ customerName }).skip(skip).limit(limit),
      this._salesModel.countDocuments({ customerName }),
    ]);
    console.log(sales, total);

    const data = sales.map((sale) => ({
      date: sale.date,
      type: 'Sale' as const,
      amount: sale.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      paymentType: sale.paymentType,
    }));

    return {
      data: data,
      total: total,
    };
  }

  async getSalesForExport(input: ExportQueryParamsDto) {
    const { customer, from, to } = input;
    const query: FilterQuery<SaleDocument> = {
      customerName: customer.trim(),
      $and: [{ date: { $gte: from } }, { date: { $lte: to } }],
    };
    return await this._salesModel.find(query).lean();
  }

  async generatePdf(res: Response, sales: SaleDocument[]) {
    const doc = new PDFDocument({ margin: 30 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sales-report.pdf"`,
    );

    doc.pipe(res);

    doc.fontSize(16).text('Sales Report', { align: 'center' });
    doc.moveDown();

    sales.forEach((sale, index) => {
      const total = sale.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );

      doc
        .fontSize(12)
        .text(`Date: ${new Date(sale.date).toLocaleDateString()}`);
      doc.text(`Customer: ${sale.customerName}`);
      doc.moveDown(0.5);

      // Table Header
      doc.font('Helvetica-Bold');
      doc.text('Item', 60);
      doc.text('Qty', 200);
      doc.text('Price', 250);
      doc.text('Subtotal', 320);
      doc.moveDown(0.3);
      doc.font('Helvetica').moveTo(60, doc.y).lineTo(500, doc.y).stroke();

      // Table Rows
      sale.items.forEach((item) => {
        const subtotal = item.price * item.quantity;
        doc.text(item.name, 60);
        doc.text(item.quantity.toString(), 200);
        doc.text(`₹${item.price.toFixed(2)}`, 250);
        doc.text(`₹${subtotal.toFixed(2)}`, 320);
        doc.moveDown(0.2);
      });

      // Total
      doc.moveDown(0.3);
      doc
        .font('Helvetica-Bold')
        .text(`Total: ₹${total.toFixed(2)}`, { align: 'right' });
      doc.moveDown(1);
    });

    doc.end();
  }

  async exportExcel(res: Response, sales: SaleDocument[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer', key: 'customerName', width: 25 },
      { header: 'Items', key: 'items', width: 40 },
      { header: 'Total Amount', key: 'total', width: 20 },
    ];

    sales.forEach((sale) => {
      worksheet.addRow({
        date: new Date(sale.date).toLocaleDateString(),
        customerName: sale.customerName,
        items: sale.items.map((i) => `${i.name} (${i.quantity})`).join(', '),
        total: sale.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sales-report.xlsx"`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportPrint(res: Response, sales: SaleDocument[]) {
    const html = `
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            .sale-entry { margin-bottom: 2rem; }
            hr { border: none; border-top: 1px solid #ccc; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Sales Report</h1>
          ${sales
            .map((sale) => {
              const total = sale.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0,
              );
              return `
              <div class="sale-entry">
                <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${sale.customerName}</p>
                <p><strong>Items:</strong> ${sale.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}</p>
                <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
                <hr />
              </div>
            `;
            })
            .join('')}
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  htmlContentForSale(sales: SaleDocument[]) {
    return `
    <html>
      <head><title>Sales Report</title></head>
      <body>
        <h1>Sales Report</h1>
        ${sales
          .map((sale) => {
            const total = sale.items.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            );
            return `
              <div>
                <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${sale.customerName}</p>
                <p><strong>Items:</strong> ${sale.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}</p>
                <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
                <hr />
              </div>
            `;
          })
          .join('')}
      </body>
    </html>
  `;
  }

  async sendEmailReport(to, sales: SaleDocument[]) {
    await this.transporter.sendMail({
      from: 'Inventory Mgmt',
      to: to,
      subject: 'Sales Report',
      html: this.htmlContentForSale(sales),
    });
  }
}