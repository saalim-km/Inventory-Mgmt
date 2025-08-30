// src/inventory/schemas/inventory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User'})
  userId: Types.ObjectId;

  @Prop({ required: true , trim : true})
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
