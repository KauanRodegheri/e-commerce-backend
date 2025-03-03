import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(5)
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}
