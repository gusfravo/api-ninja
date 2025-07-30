import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { RoleService } from './services/roles/role.service';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([Role, User])],
  controllers: [AuthController],
  providers: [RoleService, UserService, AuthService, LocalStrategy],
})
export class AuthModule {}
