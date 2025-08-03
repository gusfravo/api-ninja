import { CreateDelegation } from '@delegation/dto/create-delegation.dto';
import { FilterListDelegation } from '@delegation/dto/filter-list-delegation.dto';
import { UpdateDelagation } from '@delegation/dto/update-delegation.dto';
import { Delegation } from '@delegation/entity/delegation.entity';
import { DependenceService } from '@dependence/service/dependence.service';
import { MemberService } from '@member/service/member.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forkJoin, from, Observable, of, switchMap, throwError } from 'rxjs';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class DelegationService {
  constructor(
    @InjectRepository(Delegation)
    private delegationRepositoty: Repository<Delegation>,
    private readonly dependenceService: DependenceService,
    private readonly memberService: MemberService,
  ) {}

  onUpdate(updateDelegation: UpdateDelagation) {
    const { uuid, ...createDelegation } = updateDelegation;

    if (uuid) return this.update(updateDelegation);

    return this.create(createDelegation);
  }

  onList(filterOptions: FilterListDelegation): Observable<Delegation[]> {
    const filterQuery: FindOptionsWhere<Delegation> = { status: true };

    if (filterOptions.dependenceId)
      filterQuery.dependence = { uuid: filterOptions.dependenceId };

    return from(this.delegationRepositoty.find({ where: filterQuery }));
  }

  onGet(delegationId: string) {
    return this.get(delegationId);
  }

  onDelete(delegationId: string) {
    return this.get(delegationId).pipe(
      switchMap((updateDelegation) => {
        updateDelegation.status = false;
        return this.delegationRepositoty.save(updateDelegation);
      }),
    );
  }

  private create(createDelegation: CreateDelegation) {
    const dependence$ = this.dependenceService.get(
      createDelegation.dependenceId,
    );
    const member$ = createDelegation.titularId
      ? this.memberService.get(createDelegation.titularId)
      : of(null);

    return forkJoin({ dependence: dependence$, member: member$ }).pipe(
      switchMap(({ dependence, member }) => {
        const saveDelegation = Object.assign(new Delegation(), {
          ...createDelegation,
          dependence,
          titular: member,
        });

        return from(this.delegationRepositoty.save(saveDelegation));
      }),
    );
  }

  private update(updateDelegation: UpdateDelagation) {
    const dependence$ = this.dependenceService.get(
      updateDelegation.dependenceId,
    );
    const member$ = updateDelegation.titularId
      ? this.memberService.get(updateDelegation.titularId)
      : of(null);

    return this.get(updateDelegation.uuid).pipe(
      switchMap((delegation) => {
        delegation.code = updateDelegation.code;
        delegation.name = updateDelegation.name;
        return forkJoin({
          dependence: dependence$,
          member: member$,
        }).pipe(
          switchMap(({ dependence, member }) => {
            delegation.dependence = dependence;
            delegation.titular = member;
            return from(this.delegationRepositoty.save(delegation));
          }),
        );
      }),
    );
  }

  private get(delegationId: string) {
    return from(
      this.delegationRepositoty.findOne({ where: { uuid: delegationId } }),
    ).pipe(
      switchMap((delegation) => {
        if (!delegation)
          return throwError(
            () =>
              new NotFoundException(
                'No pudimos encontrar la delagacion descrita',
              ),
          );
        return of(delegation);
      }),
    );
  }
}
