import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RoleService } from '../roles/role.service';
import { RegisterUser } from '@auth/dtos/register-user.dto';
import { UserService } from '../user/user.service';
import { from, Observable, switchAll, switchMap, throwError } from 'rxjs';
import { encryptPassword } from '@auth/utils/encrypt.helper';
import { User } from '@auth/entities/user.entity';
import { Role } from '@auth/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  onRegister({
    username,
    roleName,
    password,
    fullName,
  }: RegisterUser): Observable<User> {
    let roleFounded: Role;
    return this.userService.onFindByUsername(username).pipe(
      switchMap((user) => {
        if (user)
          return throwError(
            () =>
              new BadRequestException(
                'El usuario ya existe no podemos registrarlo',
              ),
          );

        return from(this.roleService.onGetByName({ name: roleName }));
      }),
      switchMap((role) => {
        if (!role)
          return throwError(
            () =>
              new InternalServerErrorException(
                `El role ${roleName} no esta definido`,
              ),
          );
        roleFounded = role;
        return encryptPassword(password);
      }),
      switchMap((passwordEncrypted) => {
        const user = {
          username,
          full_name: fullName,
          password: passwordEncrypted,
          status: true,
          role: roleFounded,
        } as User;
        return this.userService.create(user);
      }),
    );
  }
}
