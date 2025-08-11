// src/customer/schemas/customer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  address: string;

  @Prop({
    required: true,
    trim: true,
  })
  mobile: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
