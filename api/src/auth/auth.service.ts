import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CustomError } from 'src/utils/custom-error';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';
import { BcryptService } from 'src/utils/services/bcrypt.service';
import { JwtService } from 'src/utils/services/jwt.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/signup.dto';
import { userMapper } from 'src/utils/mappers/mapper';
import { CustomJwtPayload } from 'src/utils/guards/auth.guard';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private _userModel : Model<UserDocument>,
        private _bcryptService : BcryptService,
        private _jwtService : JwtService
    ){}

    async signup(input : RegisterDto) {
        const {email,name,password} = input;
        const isUserExists = await this._userModel.findOne({email : email.trim()})
        if(isUserExists) throw new CustomError(ERROR_MESSAGES.USER_ALREADY_EXISTS,HTTP_STATUS.CONFLICT);

        await this._userModel.create({
            name: name,
            email: email,
            password: await this._bcryptService.hash(password)
        })
    }

    async login(input: LoginDto) : Promise<UserDocument>{
        const {email,password} = input;
        const user = await this._userModel.findOne({email : email});
        if(!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND);

        const passMatch = await this._bcryptService.compare(password,user.password);
        if(!passMatch) throw new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS,HTTP_STATUS.BAD_REQUEST);

        return userMapper(user) as UserDocument;
    }

    generateToken(user : UserDocument) : {accessToken : string , refreshToken : string} {
        const access = this._jwtService.generateAccessToken({_id:user._id as string, email : user.email})
        const refresh = this._jwtService.generateRefreshToken({_id:user._id as string , email : user.email})

        return {
            accessToken : access,
            refreshToken : refresh
        }
    }

    accessToken(input: CustomJwtPayload) : string {
        const payload = this._jwtService.verifyRefreshToken(input.refresh_token);
        if(!payload){
            throw new CustomError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS,HTTP_STATUS.UNAUTHORIZED)
        }

        return this._jwtService.generateAccessToken({_id:input._id , email : input.email});
    }
}
