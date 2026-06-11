import { UpdateUserDto } from '@auth/dtos/update-user.dto';
import { User } from '@auth/entities/user.entity';
import { UserService } from '@auth/services/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Listar todos los usuarios activos' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ type: User, isArray: true })
  @Get('list')
  list() {
    return this.userService.onList();
  }

  @ApiOperation({ summary: 'Obtener un usuario por UUID' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @ApiResponse({ type: User })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.userService.onGet(uuid);
  }

  @ApiOperation({ summary: 'Crear o actualizar un usuario' })
  @ApiBearerAuth('JWT')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ type: User })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateUserDto) {
    return this.userService.onUpdate(dto);
  }

  @ApiOperation({ summary: 'Eliminar lógicamente un usuario' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @ApiResponse({ type: User })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.userService.onDelete(uuid);
  }
}
