import {
  IsString,
  IsNotEmpty,
  IsAlphanumeric,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAuthDto {
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @IsAlphanumeric('en-US', {
    message: 'Username should contain only letters and numbers',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;
}
