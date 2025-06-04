import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Smith' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Supervisor' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 'IT' })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({ example: 'EMP-10045', required: false })
  @IsNotEmpty()
  @IsString()
  employeeId: string;

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
}
