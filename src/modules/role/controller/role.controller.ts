import { UpdateRole } from '@role/dto/update-role.dto';
import { Role } from '@role/entity/role.entity';
import { RoleService } from '@role/service/role.service';
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

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Listar todos los roles activos' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ type: Role, isArray: true })
  @Get('list')
  list() {
    return this.roleService.onList();
  }

  @ApiOperation({ summary: 'Obtener un rol por UUID' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @ApiResponse({ type: Role })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.roleService.onGet(uuid);
  }

  @ApiOperation({ summary: 'Crear o actualizar un rol' })
  @ApiBearerAuth('JWT')
  @ApiBody({ type: UpdateRole })
  @ApiResponse({ type: Role })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateRole) {
    return this.roleService.onUpdate(dto);
  }

  @ApiOperation({ summary: 'Eliminar lógicamente un rol' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @ApiResponse({ type: Role })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.roleService.onDelete(uuid);
  }
}
