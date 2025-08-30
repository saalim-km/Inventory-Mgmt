import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { PaginationDto } from '../dto/get-customer.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import type {CustomRequest} from 'src/utils/guards/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Create a customer
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateCustomerDto , @Req() req : CustomRequest) {
    const userData = {...dto,userId : req.user._id}
    const customer = await this.customerService.create(userData);
    return { message: 'Customer created successfully', data: customer };
  }


  // Get all customers (optional search by name)
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() query : PaginationDto , @Req() req : CustomRequest) {
    const input = {...query,userId : req.user._id};
    console.log(input);
    const customers = await this.customerService.findAll(input);
    return { message: 'Customer list fetched successfully', data: customers };
  }

  // Get a single customer
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const customer = await this.customerService.findOne(id);
    return { message: 'Customer fetched successfully', data: customer };
  }

  // Update a customer
  @Patch(':id')
  @UseGuards(AuthGuard)
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