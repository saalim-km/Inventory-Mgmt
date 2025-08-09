import { PartialType } from "@nestjs/mapped-types";
import { CreateInventoryDto } from "./create-inventory.dto";
import { Types } from "mongoose";
import { ToObjectId } from "src/utils/custom-decorators";

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}