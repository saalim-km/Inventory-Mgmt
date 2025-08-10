import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/auth.dto';
import { CustomError } from 'src/utils/custom-error';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private _userModel : Model<UserDocument>
    ){}

    async login(input: LoginDto){
        const {email,password} = input;
        const user = await this._userModel.findOne({email : email});
        if(!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND);

        
    }
}
