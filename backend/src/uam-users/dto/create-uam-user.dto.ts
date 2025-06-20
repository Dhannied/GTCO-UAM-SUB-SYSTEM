import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MinLength, IsEmail } from 'class-validator';

export class CreateUamUserDto {
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

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+234 9013274980', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'System Administrator', required: false })
  @IsOptional()
  @IsString()
  position?: string;
}