import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { LimitField, PageField } from 'src/utils/custom-decorators';

export class GetSalesQueryDto {
  @PageField()
  page: number;

  @LimitField()
  limit: number;
}

export class GetSalesReportDto extends GetSalesQueryDto {
  @Type(() => Date)
  @IsDate()
  from: Date;

  @Type(() => Date)
  @IsDate()
  to: Date;
}

export class ExportQueryParamsDto {
  @IsISO8601({}, { message: 'From date must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'From date is required' })
  @Transform(({ value }) => new Date(value).toISOString())
  from: string;

  @IsISO8601({}, { message: 'To date must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'To date is required' })
  @Transform(({ value }) => new Date(value).toISOString())
  to: string;

  @IsString({ message: 'Customer must be a string' })
  @IsNotEmpty({ message: 'Customer is required' })
  @Transform(({ value }) => String(value))
  customer: string;
}

export class ExportAsEmailDto {
  @IsISO8601({}, { message: 'From date must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'From date is required' })
  @Transform(({ value }) => new Date(value).toISOString())
  from: string;

  @IsISO8601({}, { message: 'To date must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'To date is required' })
  @Transform(({ value }) => new Date(value).toISOString())
  to: string;

  @IsString({ message: 'Customer must be a string' })
  @IsNotEmpty({ message: 'Customer is required' })
  @Transform(({ value }) => String(value))
  customer: string;
  
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => String(value))
  email: string;
}
