import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ServicesModule } from 'src/utils/services/services.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name : User.name , schema : UserSchema}
        ]),
        ServicesModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}