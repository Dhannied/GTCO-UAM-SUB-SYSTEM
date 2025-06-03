import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({ status: 200, description: 'Return all applications', type: [Application] })
  findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an application by id' })
  @ApiResponse({ status: 200, description: 'Return the application', type: Application })
  @ApiResponse({ status: 404, description: 'Application not found' })
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get applications by user id' })
  @ApiResponse({ status: 200, description: 'Return applications for a user', type: [Application] })
  findByUser(@Param('userId') userId: string): Promise<Application[]> {
    return this.applicationsService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 201, description: 'Application created successfully', type: Application })
  create(@Body() createApplicationDto: CreateApplicationDto): Promise<Application> {
    return this.applicationsService.create(createApplicationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully', type: Application })
  @ApiResponse({ status: 404, description: 'Application not found' })
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.applicationsService.remove(id);
  }
}