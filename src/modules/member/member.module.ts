import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';
import { MemberService } from './service/member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
