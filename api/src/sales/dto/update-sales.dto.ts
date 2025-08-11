import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "./create-sales.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}