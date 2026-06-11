import { UpdateMember } from '@member/dto/update-member.dto';
import { MemberService } from '@member/service/member.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Members')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: 'Listar miembros activos paginados' })
  @ApiBearerAuth('JWT')
  @Get('list')
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    return this.memberService.onList({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      name: name ?? '',
    });
  }

  @ApiOperation({ summary: 'Buscar miembros por nombre' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'name', type: String })
  @Get('list-by-name/:name')
  @UsePipes(new ValidationPipe())
  listByName(@Param('name') name: string) {
    return this.memberService.onListByName({ name });
  }

  @ApiOperation({ summary: 'Obtener un miembro por UUID' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.memberService.onGet(uuid);
  }

  @ApiOperation({ summary: 'Crear o actualizar un miembro' })
  @ApiBearerAuth('JWT')
  @ApiBody({ type: UpdateMember })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateMember) {
    return this.memberService.onUpdate(dto);
  }

  @ApiOperation({ summary: 'Eliminar (desactivar) un miembro' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.memberService.onDelete(uuid);
  }
}
