import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Smith' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Supervisor' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 'IT' })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({ example: 'EMP-10045', required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: '+234 9013274980', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}