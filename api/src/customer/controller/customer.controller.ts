import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Create a customer
  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.customerService.create(dto);
    return { message: 'Customer created successfully', data: customer };
  }

  // Get all customers (optional search by name)
  @Get()
  async findAll(@Query('search') search?: string) {
    const customers = await this.customerService.findAll(search);
    return { message: 'Customer list fetched successfully', data: customers };
  }

  // Get a single customer
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const customer = await this.customerService.findOne(id);
    return { message: 'Customer fetched successfully', data: customer };
  }

  // Update a customer
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    const customer = await this.customerService.update(id, dto);
    return { message: 'Customer updated successfully', data: customer };
  }

  // Delete a customer
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    await this.customerService.remove(id);
    return { message: 'Customer deleted successfully' };
  }
}