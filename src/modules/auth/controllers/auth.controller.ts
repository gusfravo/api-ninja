import { RegisterUser } from '@auth/dtos/register-user.dto';
import { AuthService } from '@auth/services/auth/auth.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: RegisterUser) {
    return this.authService.onRegister(createUserDto);
  }
}
