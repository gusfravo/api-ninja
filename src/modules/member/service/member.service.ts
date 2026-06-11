import { CreateMember } from '@member/dto/create-member.dto';
import { UpdateMember } from '@member/dto/update-member.dto';
import { Member } from '@member/entity/member.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, of, switchMap, throwError } from 'rxjs';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) { }

  onBulkInsert(listMembers: Member[]) {
    return this.memberRepository.save(listMembers, {
      chunk: listMembers.length,
    });
  }

  onUpdate(updateMember: UpdateMember) {
    const { uuid, ...createMember } = updateMember;

    if (uuid) return this.update(updateMember);

    return this.create(createMember);
  }

  onList({ page = 1, limit = 20, name = '' }: { page?: number; limit?: number; name?: string } = {}) {
    const skip = (page - 1) * limit;
    return from(
      this.memberRepository.findAndCount({
        where: { status: true, ...(name ? { full_name: Like(`%${name}%`) } : {}) },
        skip,
        take: limit,
        order: { full_name: 'ASC' },
      }),
    ).pipe(
      map(([data, total]) => ({
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })),
    );
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
    const member = this.memberRepository.create({
      full_name: createMember.full_name,
      rfc: createMember.rfc,
      birth_date: createMember.birth_date ?? new Date(),
      department: createMember.department,
      nom: createMember.nom,
      secretary: createMember.secretary,
      contribution: createMember.contribution,
      status: createMember.status ?? true,
      is_real_member: false,
    });
    return from(this.memberRepository.save(member));
  }

  private update(updateMember: UpdateMember) {
    return this.get(updateMember.uuid).pipe(
      switchMap((member) => {
        member.full_name = updateMember.full_name ?? member.full_name;
        member.rfc = updateMember.rfc ?? member.rfc;
        member.birth_date = updateMember.birth_date ?? member.birth_date;
        member.department = updateMember.department ?? member.department;
        member.nom = updateMember.nom ?? member.nom;
        member.secretary = updateMember.secretary ?? member.secretary;
        member.contribution = updateMember.contribution ?? member.contribution;
        member.status = updateMember.status ?? member.status;
        return from(this.memberRepository.save(member));
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
