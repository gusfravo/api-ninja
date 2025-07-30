import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from '../roles/role.service';
import { RegisterUser } from '@auth/dtos/register-user.dto';
import { UserService } from '../user/user.service';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { encryptPassword, matchPassword } from '@auth/utils/encrypt.helper';
import { User } from '@auth/entities/user.entity';
import { Role } from '@auth/entities/role.entity';
import { LoginUserDto } from '@auth/dtos/login-user.dto';
import { PayloadToken } from '@auth/interfaces/payload-token.interface';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { LoginToken } from '@auth/dtos/login-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  onValidate({ username, password }: LoginUserDto): Observable<User> {
    return this.userService.onFindByUsername(username).pipe(
      switchMap((user) => {
        if (!user)
          return throwError(
            () => new NotFoundException('Usuario ó contraseña invalida'),
          );
        return matchPassword(password, user.password).pipe(
          switchMap((match) => {
            if (!match)
              return throwError(
                () => new BadRequestException('Usuario ó contraseña invalida'),
              );
            return of(user);
          }),
        );
      }),
    );
  }

  onLogin(user: User): Observable<LoginToken> {
    const payload: PayloadToken = {
      username: user.username,
      fullName: user.full_name,
      role: {
        roleId: user.role.uuid,
        name: user.role.name,
      },
    };

    return from(this.jwtService.signAsync(payload)).pipe(
      switchMap((token) => {
        return of(
          plainToInstance(
            LoginToken,
            { ...user, token, tokenType: 'Bearer' },
            {
              excludeExtraneousValues: true,
            },
          ),
        );
      }),
    );
  }
}
