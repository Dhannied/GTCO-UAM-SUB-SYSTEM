import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'EMP-10045' })
  @IsNotEmpty()
  @MinLength(5)
  employeeId: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

