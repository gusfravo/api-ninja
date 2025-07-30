import { Role } from '@auth/entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  onGetByName({ name }: { name: string }) {
    return from(
      this.roleRepository.findOne({
        where: {
          name,
        },
      }),
    );
  }
}
