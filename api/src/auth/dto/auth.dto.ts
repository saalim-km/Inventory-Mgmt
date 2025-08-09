import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsValidName, Match } from 'src/utils/custom-decorators';
import {
  emailDomainRegex,
  mediumPasswordRegex,
} from 'src/utils/reusable-schema';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(emailDomainRegex, {
    message: 'Only gmail.com, yahoo.com, or outlook.com allowed',
  })
  email: string;

  @Matches(mediumPasswordRegex, {
    message:
      'Password must be at least 8 chars, with uppercase, lowercase, number, and special char',
  })
  password: string;
}

export class RegisterDto {
  @IsValidName({
    message: "Name must contain only letters/spaces and not be empty",
  })
  @MaxLength(10, { message: "Name can be at most 10 characters long" })
  name: string;

  @IsEmail()
  @Matches(emailDomainRegex, {
    message: "Only gmail.com, yahoo.com, or outlook.com allowed",
  })
  email: string;

  @Matches(mediumPasswordRegex, {
    message:
      "Password must be at least 8 chars, with uppercase, lowercase, number, and special char",
  })
  password: string;

  @Match("password", { message: "Confirm password must match password" })
  passwordConfirm: string;
}