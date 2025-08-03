import { CreateDependence } from '@dependence/dto/create-dependence.dto';
import { UpdateDependence } from '@dependence/dto/update-dependence.dto';
import { Dependence } from '@dependence/entity/dependence.entity';
import { instanceDependence } from '@dependence/operator/instance-dependence.operator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class DependenceService {
  constructor(
    @InjectRepository(Dependence)
    private dependenceRepository: Repository<Dependence>,
  ) {}

  onUpdate(updateDependence: UpdateDependence) {
    const { uuid, ...createDependence } = updateDependence;

    if (uuid) return this.update(updateDependence);

    return this.create(createDependence);
  }

  onList() {
    return from(this.dependenceRepository.find({ where: { status: true } }));
  }

  onGet(dependenceId: string) {
    return this.get(dependenceId).pipe(instanceDependence());
  }

  onDelete(dependenceId: string) {
    return this.get(dependenceId).pipe(
      switchMap((updateDependence) => {
        updateDependence.status = false;
        return this.dependenceRepository.save(updateDependence);
      }),
      instanceDependence(),
    );
  }

  private create(createDependence: CreateDependence) {
    return from(this.dependenceRepository.save(createDependence)).pipe(
      instanceDependence(),
    );
  }

  private update(updateDependence: UpdateDependence) {
    return this.get(updateDependence.uuid).pipe(
      switchMap((dependence) => {
        const saveDependence = Object.assign(dependence, updateDependence);
        return from(this.dependenceRepository.save(saveDependence));
      }),
      instanceDependence(),
    );
  }

  get(dependenceId: string) {
    return from(
      this.dependenceRepository.findOne({ where: { uuid: dependenceId } }),
    ).pipe(
      switchMap((dependence) => {
        if (!dependence)
          return throwError(
            () =>
              new NotFoundException(
                'No podimos encontrar la dependencia de gobierno',
              ),
          );

        return of(dependence);
      }),
    );
  }
}
