import { CreateMember } from '@member/dto/create-member.dto';
import { UpdateMember } from '@member/dto/update-member.dto';
import { Member } from '@member/entity/member.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, of, switchAll, switchMap, throwError } from 'rxjs';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  onUpdate(updateMember: UpdateMember) {
    const { uuid, ...createMember } = updateMember;

    if (uuid) return this.update(updateMember);

    return this.create(createMember);
  }

  onList() {
    return from(this.memberRepository.find({ where: { status: true } }));
  }
  onListByName({ name }: { name: string }) {
    return this.memberRepository.find({
      where: { status: true, full_name: Like(`%${name}%`) },
    });
  }

  onGet(memberId: string) {
    return this.get(memberId);
  }

  onDelete(memberId: string) {
    return this.get(memberId).pipe(
      switchMap((updateMemeber) => {
        updateMemeber.status = false;
        return this.memberRepository.save(updateMemeber);
      }),
    );
  }

  private create(createMember: CreateMember) {
    return from(this.memberRepository.save(createMember));
  }

  private update(updateMember: UpdateMember) {
    return this.get(updateMember.uuid).pipe(
      switchMap((member) => {
        const saveMember = Object.assign(member, updateMember);
        return from(this.memberRepository.save(saveMember));
      }),
    );
  }

  get(memberId: string) {
    return from(
      this.memberRepository.findOne({ where: { uuid: memberId } }),
    ).pipe(
      switchMap((member) => {
        if (!member)
          return throwError(
            () => new NotFoundException('No pudimos encontrar el recurso'),
          );

        return of(member);
      }),
    );
  }
}
