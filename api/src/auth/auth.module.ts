import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name : User.name , schema : UserSchema}
        ])
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}