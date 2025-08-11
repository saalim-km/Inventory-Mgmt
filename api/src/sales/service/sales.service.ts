import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale, SaleDocument } from '../schema/sale.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from '../dto/create-sales.dto';
import { UpdateOrderDto } from '../dto/update-sales.dto';
import { CustomError } from 'src/utils/custom-error';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';
import { GetSalesQueryDto, GetSalesReportDto } from '../dto/get-sales.dto';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventory/schema/inventory.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private _salesModel: Model<SaleDocument>,
    @InjectModel(Inventory.name)
    private _inventoryModel: Model<InventoryDocument>,
  ) {}

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
      this._salesModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._salesModel.countDocuments(),
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
        .find({ date: { $gte: from, $lte: to } })
        .skip(skip)
        .limit(limit),
      this._salesModel.countDocuments({ date: { $gte: from, $lte: to } }),
    ]);

    return {
      data: sales,
      total: count,
    };
  }

  async generateCustomerLedger(customerName: string, dto: GetSalesQueryDto) {
    console.log(customerName,dto.limit);
    const { limit, page } = dto;
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      this._salesModel
        .find({ customerName })
        .skip(skip)
        .limit(limit),
      this._salesModel.countDocuments({ customerName }),
    ]);
    console.log(sales,total);

    const data = sales.map((sale) => ({
      date: sale.date,
      type: 'Sale' as const,
      amount: sale.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    }));

    return {
      data : data,
      total : total
    }
  }
}
