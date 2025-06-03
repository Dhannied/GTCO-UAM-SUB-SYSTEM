import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Core Banking' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Web Application' })
  @IsNotEmpty()
  @IsString()
  platform: string;

  @ApiProperty({ example: 'Full Access' })
  @IsNotEmpty()
  @IsString()
  accessLevel: string;

  @ApiProperty({ example: 'university' })
  @IsNotEmpty()
  @IsString()
  icon: string;

  @ApiProperty({ example: '#d1e3ff' })
  @IsNotEmpty()
  @IsString()
  iconBg: string;

  @ApiProperty({ example: 'Active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}