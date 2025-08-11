import { IsEmail, Matches } from "class-validator";
import { emailDomainRegex, mediumPasswordRegex } from "src/utils/reusable-schema";

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