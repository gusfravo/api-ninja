import { DependenceResponse } from '@dependence/dto/dependence-response.dto';
import { Dependence } from '@dependence/entity/dependence.entity';
import { plainToInstance } from 'class-transformer';
import { Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';

export const instanceDependence = (): UnaryFunction<
  Observable<Dependence>,
  Observable<DependenceResponse>
> => {
  return pipe(
    switchMap((dependence: Dependence) => {
      return of(
        plainToInstance(DependenceResponse, dependence, {
          excludeExtraneousValues: true,
        }),
      );
    }),
  );
};
