import {
  IsString,
  IsDateString,
  ValidateNested,
  IsInt,
  Min,
  IsNumber,
  IsMongoId,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @ArrayMinSize(1)
  items: ItemDto[];
}
