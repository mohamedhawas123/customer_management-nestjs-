import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
 

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
