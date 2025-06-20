import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UamUsersService } from './uam-users.service';
import { CreateUamUserDto } from './dto/create-uam-user.dto';
import { UpdateUamUserDto } from './dto/update-uam-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('uam-users')
@Controller('uam-users')
export class UamUsersController {
  constructor(private readonly uamUsersService: UamUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new UAM user' })
  @ApiResponse({ status: 201, description: 'The UAM user has been successfully created.' })
  create(@Body() createUamUserDto: CreateUamUserDto) {
    return this.uamUsersService.create(createUamUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all UAM users' })
  findAll() {
    return this.uamUsersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a UAM user by ID' })
  findOne(@Param('id') id: string) {
    return this.uamUsersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a UAM user' })
  update(@Param('id') id: string, @Body() updateUamUserDto: UpdateUamUserDto) {
    return this.uamUsersService.update(id, updateUamUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a UAM user' })
  remove(@Param('id') id: string) {
    return this.uamUsersService.remove(id);
  }

  @Post('update-last-active')
  async updateAllUsersLastActive() {
    await this.uamUsersService.updateAllUsersLastActive();
    return { message: 'All users updated successfully' };
  }
}
