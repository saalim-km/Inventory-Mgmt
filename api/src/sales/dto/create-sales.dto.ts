import {
  IsString,
  IsDateString,
  ValidateNested,
  IsInt,
  Min,
  IsNumber,
  IsMongoId,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export type TPaymentType = 'cash' | 'upi' | 'card' | 'bank_transfer' | 'cod';

class ItemDto {
  @IsMongoId()
  _id: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsDateString()
  date: string;

  @IsEnum(['cash', 'upi', 'card', 'bank_transfer', 'cod'], {
    message: 'paymentType must be one of: cash, upi, card, bank_transfer, cod',
  })
  paymentType: TPaymentType;
  
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @ArrayMinSize(1)
  items: ItemDto[];
}
