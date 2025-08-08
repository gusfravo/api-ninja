import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from './entity/benefit.entity';
import { BenefitService } from './service/benefit.service';
import { BenefitController } from './controllers/benefit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit])],
  controllers: [BenefitController],
  providers: [BenefitService],
  exports: [BenefitService],
})
export class BenefitModule {}
