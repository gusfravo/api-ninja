import { User } from '@auth/entities/user.entity';
import { UpdateUserDto } from '@auth/dtos/update-user.dto';
import { RoleService } from '@auth/services/roles/role.service';
import { encryptPassword } from '@auth/utils/encrypt.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  onFindByUsername(username: string) {
    return from(
      this.userRepository.findOne({
        where: { username },
        relations: { role: true },
      }),
    );
  }

  create(user: User) {
    return from(this.userRepository.save(user));
  }

  onList() {
    return from(
      this.userRepository.find({
        where: { status: true },
        relations: { role: true },
      }),
    );
  }

  onGet(uuid: string) {
    return this.get(uuid);
  }

  onUpdate(dto: UpdateUserDto) {
    if (dto.uuid) return this.update(dto);
    return this.createFromDto(dto);
  }

  onDelete(uuid: string) {
    return this.get(uuid).pipe(
      switchMap((user) => {
        user.status = false;
        return from(this.userRepository.save(user));
      }),
    );
  }

  private createFromDto(dto: UpdateUserDto) {
    return this.roleService.onGet(dto.roleId).pipe(
      switchMap((role) =>
        encryptPassword(dto.password!).pipe(
          switchMap((hash) => {
            const user = this.userRepository.create({
              username: dto.username,
              full_name: dto.fullName,
              password: hash,
              status: dto.status,
              role,
            });
            return from(this.userRepository.save(user));
          }),
        ),
      ),
    );
  }

  private update(dto: UpdateUserDto) {
    return this.get(dto.uuid!).pipe(
      switchMap((user) =>
        this.roleService.onGet(dto.roleId).pipe(
          switchMap((role) => {
            const applyUpdate = (hash?: string) => {
              user.username = dto.username;
              user.full_name = dto.fullName;
              user.status = dto.status;
              user.role = role;
              if (hash) user.password = hash;
              return from(this.userRepository.save(user));
            };

            return dto.password
              ? encryptPassword(dto.password).pipe(switchMap(applyUpdate))
              : applyUpdate();
          }),
        ),
      ),
    );
  }

  private get(uuid: string) {
    return from(
      this.userRepository.findOne({ where: { uuid }, relations: { role: true } }),
    ).pipe(
      switchMap((user) => {
        if (!user)
          return throwError(() => new NotFoundException('Usuario no encontrado'));
        return of(user);
      }),
    );
  }
}
