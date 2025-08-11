import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-sales.dto';
import { SalesService } from '../service/sales.service';
import { SUCCESS_MESSAGES } from 'src/utils/constants';
import { GetSalesQueryDto, GetSalesReportDto } from '../dto/get-sales.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('sale')
export class SalesController {
    constructor(
        private _salesService : SalesService
    ){}
    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto : CreateOrderDto) {
        const data = await this._salesService.create(dto)
        return {message : SUCCESS_MESSAGES.ORDER_PLACED,data}
    }

    @Get()
    @UseGuards(AuthGuard)
    async get(@Query() dto:  GetSalesQueryDto) {
        const data = await this._salesService.get(dto);
        return {message : SUCCESS_MESSAGES.DATA_RETRIEVED,data}
    }

    @Get('daterange')
    @UseGuards(AuthGuard)
    async getSalesReportByDateRange(@Query()dto: GetSalesReportDto) {
        const data = await this._salesService.generateSalesReport(dto);
        return {message : SUCCESS_MESSAGES.SALES_REPORT_GENERATED, data}
    }

    @Get('ledger/:name')
    @UseGuards(AuthGuard)
    async customerLedger(@Param('name') customerName : string , @Query() dto : GetSalesQueryDto) {
        const data = await this._salesService.generateCustomerLedger(customerName,dto)
        return {message : SUCCESS_MESSAGES.DATA_RETRIEVED,data}
    }
}
