// src/inventory/helpers/inventory.mapper.ts

import { InventoryDocument } from "../schema/inventory.schema";

export const mapInventoryResponse = (inventory: InventoryDocument) => {
  return {
    _id: inventory._id,
    name: inventory.name,
    description: inventory.description,
    quantity: inventory.quantity,
    price: inventory.price,
    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
  };
};