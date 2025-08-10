import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SUCCESS_MESSAGES } from 'src/utils/constants';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { InventoryService } from '../service/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { GetInventoryQueryDto } from '../dto/get-inventory.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly _inventoryService : InventoryService) {}

    @Post()
    async create(@Body() dto : CreateInventoryDto) {
        const data = await this._inventoryService.create(dto);
        return {message : SUCCESS_MESSAGES.ITEM_ADDED,data};
    }

    @Put(':id')
    async update(@Param('id',ParseObjectIdPipe) id : Types.ObjectId, @Body() dto : UpdateInventoryDto) {
        console.log('enter into update controller');
        console.log('asdfsdfs',id);
        await this._inventoryService.update(id,dto)
        return {message : SUCCESS_MESSAGES.ITEM_UPDATED};
    }

    @Delete(':id')
    async delete(@Param('id',ParseObjectIdPipe) id : Types.ObjectId) {
        await this._inventoryService.remove(id);
        return {message : SUCCESS_MESSAGES.ITEM_DELETED};
    }

    @Get()
    async get(@Query() dto : GetInventoryQueryDto) {
        const data = await this._inventoryService.findAll(dto);
        return {message : SUCCESS_MESSAGES.DATA_RETRIEVED,data}
    }
}