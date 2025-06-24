// dto/deactivate-application.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeactivateApplicationDto {
  @IsEnum(['Inactive', 'Active'])
  status: 'Inactive' | 'Active';

  @IsEnum(['Temporary', 'Permanent'])
  deactivationType: 'Temporary' | 'Permanent';

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
