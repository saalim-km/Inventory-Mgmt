// src/inventory/helpers/inventory.mapper.ts

import { UserDocument } from "src/auth/schema/user.schema";
import { InventoryDocument } from "src/inventory/schema/inventory.schema";

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

export const userMapper = (user : UserDocument) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  }
}