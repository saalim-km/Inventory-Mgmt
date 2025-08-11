import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LimitField, PageField } from 'src/utils/custom-decorators';

export class PaginationDto {
  @PageField() // minimum value 1
  page: number;
    
  @LimitField()
  limit: number;
}
