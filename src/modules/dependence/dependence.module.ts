import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dependence } from './entity/dependence.entity';
import { DependenceService } from './service/dependence.service';
import { DependenceController } from './controllers/dependence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dependence])],
  controllers: [DependenceController],
  providers: [DependenceService],
})
export class DependenceModule {}
