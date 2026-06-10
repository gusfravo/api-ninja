import { UpdateEventMember } from '@event/dto/update-event-member.dto';
import { EventMemberService } from '@event/services/event-member.service';
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
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Event Members')
@Controller('event-member')
export class EventMemberController {
  constructor(private readonly eventMemberService: EventMemberService) {}

  @ApiOperation({ summary: 'Listar miembros por EventFile' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'eventFileId', type: String, format: 'uuid' })
  @Get('list/:eventFileId')
  @UsePipes(new ValidationPipe())
  list(@Param('eventFileId') eventFileId: string) {
    return this.eventMemberService.findByEventFile(eventFileId);
  }

  @ApiOperation({ summary: 'Obtener un miembro por UUID' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.eventMemberService.onGet(uuid);
  }

  @ApiOperation({ summary: 'Crear o actualizar un EventMember' })
  @ApiBearerAuth('JWT')
  @ApiBody({ type: UpdateEventMember })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateEventMember) {
    return this.eventMemberService.onUpdate(dto);
  }

  @ApiOperation({ summary: 'Eliminar un EventMember' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.eventMemberService.onDelete(uuid);
  }
}
