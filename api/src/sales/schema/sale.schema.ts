import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ _id: false })
export class SaleItem {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: [SaleItem], required: true })
  items: SaleItem[];

  @Prop({ type: String, required: true })
  customerName: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);