import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
  async hash(original: string): Promise<string> {
    return await bcrypt.hash(original, 10);
  }

  async compare(current: string, original: string): Promise<boolean> {
    return bcrypt.compare(current, original);
  }
}