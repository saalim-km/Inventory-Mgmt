// src/inventory/dto/get-inventory-query.dto.ts

import { LimitField, PageField, SearchField } from "src/utils/custom-decorators";

export class GetInventoryQueryDto {
  @PageField()
  page: number;

  @LimitField()
  limit: number;

  @SearchField()
  search?: string;
}
