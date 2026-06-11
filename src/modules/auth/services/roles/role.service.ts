import { Role } from '@auth/entities/role.entity';
import { UpdateRoleDto } from '@auth/dtos/update-role.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  onGetByName({ name }: { name: string }) {
    return from(this.roleRepository.findOne({ where: { name } }));
  }

  onList() {
    return from(this.roleRepository.find({ where: { status: true } }));
  }

  onGet(uuid: string) {
    return this.get(uuid);
  }

  onUpdate(dto: UpdateRoleDto) {
    if (dto.uuid) return this.update(dto);
    return this.create(dto);
  }

  onDelete(uuid: string) {
    return this.get(uuid).pipe(
      switchMap((role) => {
        role.status = false;
        return from(this.roleRepository.save(role));
      }),
    );
  }

  private create(dto: UpdateRoleDto) {
    const role = this.roleRepository.create({
      name: dto.name,
      description: dto.description ?? '',
      status: dto.status,
    });
    return from(this.roleRepository.save(role));
  }

  private update(dto: UpdateRoleDto) {
    return this.get(dto.uuid!).pipe(
      switchMap((role) => {
        Object.assign(role, {
          name: dto.name,
          description: dto.description ?? role.description,
          status: dto.status,
        });
        return from(this.roleRepository.save(role));
      }),
    );
  }

  private get(uuid: string) {
    return from(this.roleRepository.findOne({ where: { uuid } })).pipe(
      switchMap((role) => {
        if (!role)
          return throwError(() => new NotFoundException('Rol no encontrado'));
        return of(role);
      }),
    );
  }
}
