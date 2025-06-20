import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UamUsersController } from './uam-users.controller';
import { UamUsersService } from './uam-users.service';
import { UamUser } from './entities/uam-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UamUser])],
  controllers: [UamUsersController],
  providers: [UamUsersService],
  exports: [UamUsersService],
})
export class UamUsersModule {}