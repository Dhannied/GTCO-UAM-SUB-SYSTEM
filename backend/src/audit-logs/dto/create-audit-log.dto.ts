import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiProperty({ example: 'John Smith' })
  @IsNotEmpty()
  @IsString()
  employee: string;

  @ApiProperty({ example: 'EMP-10045' })
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'Core Banking' })
  @IsNotEmpty()
  @IsString()
  application: string;

  @ApiProperty({ example: 'Deactivation' })
  @IsNotEmpty()
  @IsString()
  actionType: string;

  @ApiProperty({ example: 'Employee on leave' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ example: 'Admin User' })
  @IsNotEmpty()
  @IsString()
  officer: string;
}