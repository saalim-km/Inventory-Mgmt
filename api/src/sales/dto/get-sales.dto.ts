import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
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