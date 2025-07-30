import { LoginToken } from '@auth/dtos/login-token.dto';
import { LoginUserDto } from '@auth/dtos/login-user.dto';
import { RegisterUser } from '@auth/dtos/register-user.dto';
import { User } from '@auth/entities/user.entity';
import { AuthService } from '@auth/services/auth/auth.service';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Metodo para crear un usuario' })
  @ApiBody({
    type: RegisterUser,
  })
  @ApiResponse({
    type: User,
  })
  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: RegisterUser) {
    return this.authService.onRegister(createUserDto);
  }

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    type: LoginToken,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Request() req): Observable<LoginToken> {
    const user = req.user as User;
    return this.authService.onLogin(user);
  }
}
