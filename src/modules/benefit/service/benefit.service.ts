import { CreateBenefit } from '@benefit/dto/create-benefit.dto';
import { UpdateBenefit } from '@benefit/dto/update-benefit.dto';
import { Benefit } from '@benefit/entity/benefit.entity';
import { benefitInstance } from '@benefit/operator/benefit-instance.operator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class BenefitService {
  constructor(
    @InjectRepository(Benefit) private benefitRepository: Repository<Benefit>,
  ) {}

  onUpdate(updateBenefit: UpdateBenefit) {
    const { uuid, ...createBenefit } = updateBenefit;

    if (uuid) return this.update(updateBenefit);

    return this.create(createBenefit);
  }

  private create(createBenefit: CreateBenefit) {
    return from(this.benefitRepository.save(createBenefit)).pipe(
      benefitInstance(),
    );
  }

  private update(updateBenefit: UpdateBenefit) {
    return from(
      this.benefitRepository.findOne({ where: { uuid: updateBenefit.uuid } }),
    ).pipe(
      switchMap((benefit) => {
        if (!benefit)
          return throwError(
            () =>
              new NotFoundException(
                'La persión a actualizar no fue encontrada, no podemos continuar',
              ),
          );
        const saveBenefit = { ...benefit } as Benefit;
        saveBenefit.name = updateBenefit.name;
        saveBenefit.status = updateBenefit.status;
        return from(this.benefitRepository.save(saveBenefit));
      }),
      benefitInstance(),
    );
  }

  onList(): Observable<Benefit[]> {
    return from(this.benefitRepository.find({ where: { status: true } }));
  }

  onGet(benefitId: string) {
    return this.get(benefitId).pipe(benefitInstance());
  }

  private get(benefitId: string) {
    return from(
      this.benefitRepository.findOne({ where: { uuid: benefitId } }),
    ).pipe(
      switchMap((benefit) => {
        if (!benefit)
          return throwError(
            () => new NotFoundException('No podimos enocontrar la persión'),
          );

        return of(benefit);
      }),
    );
  }

  onDelete(benefitId: string) {
    return this.get(benefitId).pipe(
      switchMap((updateBenefit) => {
        updateBenefit.status = false;
        return this.benefitRepository.save(updateBenefit);
      }),
      benefitInstance(),
    );
  }
}
