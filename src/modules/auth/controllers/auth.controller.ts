import { RegisterUser } from '@auth/dtos/register-user.dto';
import { User } from '@auth/entities/user.entity';
import { AuthService } from '@auth/services/auth/auth.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}
