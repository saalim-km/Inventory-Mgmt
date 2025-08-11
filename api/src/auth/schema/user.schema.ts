import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, trim: true})
    name: string;

    @Prop({required: true , unique: true})
    email: string;

    @Prop({required: true, trim: true, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ })
    password: string;

    createdAt ?: Date;
    updateddAt ?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);