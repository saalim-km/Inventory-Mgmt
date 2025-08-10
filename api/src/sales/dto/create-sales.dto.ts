import { IsDateString, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsDateString()
  date: string; // ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  customerName?: string; // Optional if it's a cash sale

  @IsOptional()
  cash?: boolean; // true if it's a cash sale, false or undefined otherwise
}
