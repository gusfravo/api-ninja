import { UpdateEventMemberAdditional } from '@event/dto/update-event-member-additional.dto';
import { EventMemberAdditionalService } from '@event/services/event-member-additional.service';
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

@ApiTags('Event Member Additional States')
@Controller('event-member-additional')
export class EventMemberAdditionalController {
  constructor(private readonly additionalService: EventMemberAdditionalService) {}

  @ApiOperation({ summary: 'Listar estados adicionales por EventMember' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'eventMemberId', type: String, format: 'uuid' })
  @Get('list/:eventMemberId')
  @UsePipes(new ValidationPipe())
  list(@Param('eventMemberId') eventMemberId: string) {
    return this.additionalService.findByEventMember(eventMemberId);
  }

  @ApiOperation({ summary: 'Obtener un estado adicional por UUID' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.additionalService.onGet(uuid);
  }

  @ApiOperation({ summary: 'Crear o actualizar un estado adicional' })
  @ApiBearerAuth('JWT')
  @ApiBody({ type: UpdateEventMemberAdditional })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateEventMemberAdditional) {
    return this.additionalService.onUpdate(dto);
  }

  @ApiOperation({ summary: 'Eliminar un estado adicional' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid' })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.additionalService.onDelete(uuid);
  }
}
