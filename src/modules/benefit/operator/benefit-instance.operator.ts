import { BenefitResponse } from '@benefit/dto/benefit-response.dto';
import { Benefit } from '@benefit/entity/benefit.entity';
import { plainToInstance } from 'class-transformer';
import { Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';

/*
 * Operador para motrar de forma agradable la informacion en el frontend
 * */
export const benefitInstance = (): UnaryFunction<
  Observable<Benefit>,
  Observable<BenefitResponse>
> => {
  return pipe(
    switchMap((benefit: Benefit) => {
      return of(plainToInstance(BenefitResponse, benefit));
    }),
  );
};
