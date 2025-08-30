// src/inventory/inventory.service.ts
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CustomError } from 'src/utils/custom-error';
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from 'src/utils/constants';
import { Inventory, InventoryDocument } from '../schema/inventory.schema';
import { GetInventoryQueryDto } from '../dto/get-inventory.dto';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { mapInventoryResponse } from 'src/utils/mappers/mapper';
import { Sale, SaleDocument } from 'src/sales/schema/sale.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private _inventoryModel: Model<InventoryDocument>,
    @InjectModel(Sale.name) private _salesModel: Model<SaleDocument>,
  ) {}

  async create(input: CreateInventoryDto) {
    console.log(input);
    const isItemExists = await this._inventoryModel.findOne({userId : (input as any).userId,
      name: new RegExp(input.name.trim()),
    });
    if (isItemExists)
      throw new CustomError(
        ERROR_MESSAGES.ITEM_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    const created = await this._inventoryModel.create(input);
    return mapInventoryResponse(created);
  }

  async findAll(input: GetInventoryQueryDto) {
    const { limit, page, search } = input;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<InventoryDocument> = search
      ? {
          userId: (input as any).userId,
          $or: [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
          ],
        }
      : { userId: (input as any).userId };

      console.log(filter);
      
    const [items, count] = await Promise.all([
      this._inventoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._inventoryModel.countDocuments(filter),
    ]);

    return {
      data: items.map(mapInventoryResponse),
      total: count,
    };
  }

  async findOne(inventoryId: Types.ObjectId) {
    const item = await this._inventoryModel.findById(inventoryId).exec();
    if (!item)
      throw new CustomError(
        ERROR_MESSAGES.ITEM_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
  }

  async update(id: Types.ObjectId, input: UpdateInventoryDto) {
    const { description, name, price, quantity } = input;
    const updated = await this._inventoryModel
      .findByIdAndUpdate(
        id,
        {
          name: name,
          description: description,
          price: price,
          quantity: quantity,
        },
        { new: true },
      )
      .exec();

    if (!updated)
      throw new CustomError(
        ERROR_MESSAGES.ITEM_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    return mapInventoryResponse(updated);
  }

  async remove(inventoryId: Types.ObjectId) {
    const deleted = await this._inventoryModel.findByIdAndDelete(inventoryId);
    if (!deleted)
      throw new CustomError(
        ERROR_MESSAGES.ITEM_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
  }

  async generateItemReport(dto: GetInventoryQueryDto) {
    const { limit, page } = dto;
    const skip = (page - 1) * limit;

    // Fetch everything once
    const [sales, allItems] = await Promise.all([
      this._salesModel.find({userId : (dto as any).userId}),
      this._inventoryModel.find({userId : (dto as any).userId}),
    ]);

    const salesCountMap = new Map<string, number>();

    for (const sale of sales) {
      for (const saleItem of sale.items) {
        const itemName = saleItem.name.trim().toLowerCase();
        const current = salesCountMap.get(itemName) || 0;
        salesCountMap.set(itemName, current + Number(saleItem.quantity));
      }
    }

    // Map inventory to report format
    const allData = allItems.map((item) => {
      const sold = salesCountMap.get(item.name.trim().toLowerCase()) || 0;
      const totalSales = sold * item.price;

      return {
        name: item.name,
        sold,
        stock: item.quantity,
        price: item.price,
        totalSales,
      };
    });

    // Slice the results in memory for pagination
    const paginatedData = allData.slice(skip, skip + limit);

    return {
      data: paginatedData,
      total: allData.length, // total inventory count
    };
  }
}
