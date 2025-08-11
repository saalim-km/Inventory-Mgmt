import { forwardRef, Module } from '@nestjs/common';
import { SalesService } from './service/sales.service';
import { SalesController } from './controller/sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './schema/sale.schema';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ServicesModule } from 'src/utils/services/services.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    forwardRef(() => InventoryModule),
    ServicesModule,
  ],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [MongooseModule],
})
export class SalesModule {}
