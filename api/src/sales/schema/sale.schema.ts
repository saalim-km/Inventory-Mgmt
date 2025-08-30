import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TPaymentType } from '../dto/create-sales.dto';

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
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ["cash", "upi", "card", "bank_transfer", "cod"],
  })
  paymentType : string;
  
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: [SaleItem], required: true })
  items: SaleItem[];

  @Prop({ type: String, required: true })
  customerName: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
