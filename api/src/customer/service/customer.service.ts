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
      $or: [{ mobile: dto.mobile.trim() }],
    });

    if (isCustomerExist) {
      throw new CustomError(
        'Mobile already connected to another user',
        HTTP_STATUS.CONFLICT,
      );
    }
    const createdCustomer = await this._customerModel.create(dto);
    return createdCustomer;
  }

  // Get all customers with optional search
  async findAll(query: { page: number; limit: number }) {
    console.log('query in service', query);
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    console.log(skip, limit);
    const [customers, count] = await Promise.all([
      this._customerModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._customerModel.countDocuments().exec(),
    ]);
    return {
      data: customers,
      total: count,
    };
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
