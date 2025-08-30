import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-sales.dto';
import { SalesService } from '../service/sales.service';
import { SUCCESS_MESSAGES } from 'src/utils/constants';
import {
  ExportQueryParamsDto,
  GetSalesQueryDto,
  GetSalesReportDto,
} from '../dto/get-sales.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import type { Response } from 'express';
import type { CustomRequest } from 'src/utils/guards/auth.guard';

@Controller('sale')
export class SalesController {
  constructor(private _salesService: SalesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateOrderDto, @Req() req: CustomRequest) {
    const input = { ...dto, userId: req.user._id };
    const data = await this._salesService.create(input);
    return { message: SUCCESS_MESSAGES.ORDER_PLACED, data };
  }

  @Get()
  @UseGuards(AuthGuard)
  async get(@Query() dto: GetSalesQueryDto, @Req() req: CustomRequest) {
    const input = { ...dto, userId: req.user._id };
    const data = await this._salesService.get(input);
    return { message: SUCCESS_MESSAGES.DATA_RETRIEVED, data };
  }

  @Get('daterange')
  @UseGuards(AuthGuard)
  async getSalesReportByDateRange(
    @Query() dto: GetSalesReportDto,
    @Req() req: CustomRequest,
  ) {
    const input = { ...dto, userId: req.user._id };
    const data = await this._salesService.generateSalesReport(input);
    return { message: SUCCESS_MESSAGES.SALES_REPORT_GENERATED, data };
  }

  @Get('ledger/:name')
  @UseGuards(AuthGuard)
  async customerLedger(
    @Param('name') customerName: string,
    @Query() dto: GetSalesQueryDto,
  ) {
    const data = await this._salesService.generateCustomerLedger(
      customerName,
      dto,
    );
    return { message: SUCCESS_MESSAGES.DATA_RETRIEVED, data };
  }

  @Get('/export/excel')
  @UseGuards(AuthGuard)
  async exportExcel(@Query() dto: ExportQueryParamsDto, @Res() res: Response) {
    console.log(dto);
    const sales = await this._salesService.getSalesForExport(dto);
    console.log(sales);
    return this._salesService.exportExcel(res, sales);
  }

  @Get('/export/pdf')
  @UseGuards(AuthGuard)
  async exportPdf(@Query() dto: ExportQueryParamsDto, @Res() res: Response) {
    console.log(dto);
    const sales = await this._salesService.getSalesForExport(dto);
    console.log(sales);
    return this._salesService.generatePdf(res, sales);
  }

  @Get('/export/print')
  @UseGuards(AuthGuard)
  async exportPrint(@Query() dto: ExportQueryParamsDto, @Res() res: Response) {
    console.log(dto);
    const sales = await this._salesService.getSalesForExport(dto);
    console.log(sales);
    return this._salesService.exportPrint(res, sales);
  }
}
