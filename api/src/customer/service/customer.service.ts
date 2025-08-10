import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from '../schema/customer.schema';
import { Model } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomError } from 'src/utils/custom-error';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private _customerModel: Model<CustomerDocument>,
  ) {}

  // Create a new customer
  async create(dto: CreateCustomerDto) {
    const isCustomerExist = await this._customerModel.findOne({
      name: new RegExp(dto.name.trim(), 'i'),
    });
    if (isCustomerExist)
      throw new CustomError(
        ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    const createdCustomer = await this._customerModel.create(dto);
    return createdCustomer;
  }

  // Get all customers with optional search
  async findAll(search?: string) {
    const filter = search ? { name: new RegExp(search.trim(), 'i') } : {};
    return await this._customerModel.find(filter).exec();
  }

  // Get a single customer by ID
  async findOne(id: string) {
    const customer = await this._customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  // Update a customer by ID
  async update(id: string, dto: UpdateCustomerDto) {
    const updatedCustomer = await this._customerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return updatedCustomer;
  }

  // Delete a customer by ID
  async remove(id: string) {
    const deletedCustomer = await this._customerModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return { message: 'Customer deleted successfully' };
  }
}