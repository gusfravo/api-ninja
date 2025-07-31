import { CreateBenefit } from '@benefit/dto/create-benefit.dto';
import { UpdateBenefit } from '@benefit/dto/update-benefit.dto';
import { Benefit } from '@benefit/entity/benefit.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, switchMap, throwError } from 'rxjs';
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
    return from(this.benefitRepository.save(createBenefit));
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
    );
  }
}
