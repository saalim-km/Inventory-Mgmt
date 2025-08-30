import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SUCCESS_MESSAGES } from 'src/utils/constants';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { InventoryService } from '../service/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { GetInventoryQueryDto } from '../dto/get-inventory.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import type { CustomRequest } from 'src/utils/guards/auth.guard';

@Controller('item')
export class InventoryController {
  constructor(private readonly _inventoryService: InventoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateInventoryDto, @Req() req: CustomRequest) {
    const bodyData = { ...dto, userId: req.user._id };
    const data = await this._inventoryService.create(bodyData);
    return { message: SUCCESS_MESSAGES.ITEM_ADDED, data };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateInventoryDto,
  ) {
    console.log('enter into update controller');
    console.log('asdfsdfs', id);
    await this._inventoryService.update(id, dto);
    return { message: SUCCESS_MESSAGES.ITEM_UPDATED };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this._inventoryService.remove(id);
    return { message: SUCCESS_MESSAGES.ITEM_DELETED };
  }

  @Get()
  @UseGuards(AuthGuard)
  async get(@Query() dto: GetInventoryQueryDto , @Req() req: CustomRequest) {
    const input = {...dto,userId: req.user._id}
    const data = await this._inventoryService.findAll(input);
    return { message: SUCCESS_MESSAGES.DATA_RETRIEVED, data };
  }

  @Get('report')
  @UseGuards(AuthGuard)
  async generateItemReport(@Query() dto: GetInventoryQueryDto , @Req() req: CustomRequest) {
    const input = {...dto,userId: req.user._id};
    const data = await this._inventoryService.generateItemReport(input);
    return { message: SUCCESS_MESSAGES.ITEM_REPORT_CREATED, data };
  }
}
