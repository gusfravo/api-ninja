import { Role } from '@auth/entities/role.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role])
  ],
  providers: [],
  exports: [],
})
export class NinjaModule { }
