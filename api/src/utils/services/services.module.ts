import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';

@Module({
    providers : [BcryptService,JwtService],
    exports : [BcryptService,JwtService]
})
export class ServicesModule {}
