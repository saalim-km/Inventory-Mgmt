// src/inventory/schemas/inventory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true , trim : true})
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;

  // These will be automatically managed by Mongoose
  createdAt?: Date;
  updatedAt?: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
