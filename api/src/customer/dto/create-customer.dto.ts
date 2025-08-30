import { IsString, IsNotEmpty, Matches, IsMongoId } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'Mobile number must be exactly 10 digits',
  })
  mobile: string;
}
