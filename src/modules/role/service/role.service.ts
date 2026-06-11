import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { Role } from '@role/entity/role.entity';
import { CreateRole } from '@role/dto/create-role.dto';
import { UpdateRole } from '@role/dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  onList(): Observable<Role[]> {
    return from(this.roleRepository.find({ where: { status: true } }));
  }

  onGet(roleId: string) {
    return this.get(roleId);
  }

  onUpdate(updateRole: UpdateRole) {
    const { uuid, ...createRole } = updateRole;
    if (uuid) return this.update(updateRole);
    return this.create(createRole);
  }

  onDelete(roleId: string) {
    return this.get(roleId).pipe(
      switchMap((role) => {
        role.status = false;
        return from(this.roleRepository.save(role));
      }),
    );
  }

  private create(createRole: CreateRole) {
    const role = this.roleRepository.create(createRole);
    return from(this.roleRepository.save(role));
  }

  private update(updateRole: UpdateRole) {
    return this.get(updateRole.uuid!).pipe(
      switchMap((role) => {
        Object.assign(role, updateRole);
        return from(this.roleRepository.save(role));
      }),
    );
  }

  private get(roleId: string) {
    return from(
      this.roleRepository.findOne({ where: { uuid: roleId } }),
    ).pipe(
      switchMap((role) => {
        if (!role)
          return throwError(
            () => new NotFoundException('No se encontró el rol indicado'),
          );
        return of(role);
      }),
    );
  }
}
