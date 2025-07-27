import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { DependenceModule } from './dependence/dependence.module';

@Module({
  imports: [AuthModule, DependenceModule],
  providers: [],
  exports: [],
})
export class NinjaModule { }
