import { PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiProperty({ required: false, example: 'Inactive' })
  @IsOptional()
  @IsString()
  status?: string;
  
  @ApiProperty({ required: false, example: 'Temporary' })
  @IsOptional()
  @IsString()
  deactivationType?: string;
}