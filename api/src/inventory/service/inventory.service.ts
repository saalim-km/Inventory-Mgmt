// src/inventory/inventory.service.ts
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CustomError } from 'src/utils/custom-error';
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from 'src/utils/constants';
import { Inventory, InventoryDocument } from '../schema/inventory.schema';
import { GetInventoryQueryDto } from '../dto/get-inventory.dto';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { mapInventoryResponse } from 'src/utils/inventory.mapper';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(Inventory.name) private _inventoryModel : Model<InventoryDocument>,
    ) {}

    async create (input : CreateInventoryDto) {
        const isItemExists = await this._inventoryModel.findOne({name : new RegExp(input.name.trim(),"i")})
        if(isItemExists) throw new CustomError(ERROR_MESSAGES.ITEM_ALREADY_EXISTS,HTTP_STATUS.CONFLICT);
        const created = await this._inventoryModel.create(input)
        return mapInventoryResponse(created)
    }

    async findAll(input : GetInventoryQueryDto) {
        const {limit,page,search} = input;
        const skip = (page - 1) * limit;

        const filter : FilterQuery<InventoryDocument> = search ? {$or : [{name : new RegExp(search,'i')} , {description : new RegExp(search,'i')}]} : {};
        const items = await this._inventoryModel.find(filter).skip(skip).limit(limit).exec()
        return items.map(mapInventoryResponse)
    }

    async findOne(inventoryId : Types.ObjectId) {
        const item = await this._inventoryModel.findById(inventoryId).exec();
        if(!item) throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    }

    async update(id : Types.ObjectId , input : UpdateInventoryDto) {
        const {description,name,price,quantity} = input;
        const updated = await this._inventoryModel.findByIdAndUpdate(id , {
            name : name,
            description : description,
            price : price,
            quantity : quantity
        } , {new : true}).exec()
        
        if(!updated) throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        return mapInventoryResponse(updated);
    }

    async remove(inventoryId : Types.ObjectId) {
        const deleted = await this._inventoryModel.findByIdAndDelete(inventoryId);
        if(!deleted) throw new CustomError(ERROR_MESSAGES.ITEM_NOT_FOUND,HttpStatus.NOT_FOUND)
    }
}