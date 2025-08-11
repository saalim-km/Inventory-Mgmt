import { Module } from '@nestjs/common';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './service/customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { ServicesModule } from 'src/utils/services/services.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    ServicesModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
