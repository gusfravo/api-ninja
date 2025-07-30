import { User } from '@auth/entities/user.entity';
import { AuthService } from '@auth/services/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
    });
  }
  async validate(username: string, password: string): Promise<User> {
    const user: User = await lastValueFrom(
      this.authService.onValidate({ username, password }),
    );
    if (!user) {
      throw new UnauthorizedException('Acceso no autorizado');
    }
    return user;
  }
}
