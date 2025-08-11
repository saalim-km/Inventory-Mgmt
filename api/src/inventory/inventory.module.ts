import { forwardRef, Module } from '@nestjs/common';
import { InventoryController } from './controller/inventory.controller';
import { InventoryService } from './service/inventory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schema/inventory.schema';
import { ServicesModule } from 'src/utils/services/services.module';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
    forwardRef(() => ServicesModule),
    SalesModule,
    ServicesModule
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [MongooseModule],
})
export class InventoryModule {}
