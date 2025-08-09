import { IsString, IsNumber, Min, MaxLength, IsOptional } from "class-validator";
import { IsValidName } from "src/utils/custom-decorators";

export class CreateInventoryDto {
  @IsString()
  @IsValidName()
  @MaxLength(10)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(50 , {message : "Min of 50 rupees should be added to the price"})
  price: number;
}