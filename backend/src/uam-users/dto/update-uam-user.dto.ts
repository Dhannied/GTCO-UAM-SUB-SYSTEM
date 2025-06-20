import { PartialType } from '@nestjs/swagger';
import { CreateUamUserDto } from './create-uam-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUamUserDto extends PartialType(CreateUamUserDto) {
  @ApiProperty({ required: false, example: 'Active' })
  @IsOptional()
  @IsString()
  status?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  lastActive?: Date;
}