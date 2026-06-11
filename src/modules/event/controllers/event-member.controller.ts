import { UpdateEventMember } from '@event/dto/update-event-member.dto';
import { EventMemberAdditionalService } from '@event/services/event-member-additional.service';
import { EventMemberExcelService } from '@event/services/event-member-excel.service';
import { EventMemberService } from '@event/services/event-member.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
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
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@ApiTags('Event Members')
@Controller('event-member')
export class EventMemberController {
  constructor(
    private readonly eventMemberService: EventMemberService,
    private readonly eventMemberAdditionalService: EventMemberAdditionalService,
    private readonly eventMemberExcelService: EventMemberExcelService,
  ) {}

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

  @ApiOperation({ summary: 'Listar estados adicionales por EventMember' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'uuid', type: String, format: 'uuid', description: 'ID del EventMember' })
  @Get('additional/:uuid')
  @UsePipes(new ValidationPipe())
  listAdditional(@Param('uuid') uuid: string) {
    return this.eventMemberAdditionalService.findByEventMember(uuid);
  }

  @ApiOperation({ summary: 'Exportar todos los agremiados de un evento a Excel' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'eventId', type: String, format: 'uuid' })
  @Get('export-event/:eventId')
  async exportByEvent(
    @Param('eventId') eventId: string,
    @Res() res: Response,
  ) {
    const { buffer } = await lastValueFrom(
      this.eventMemberExcelService.generateByEvent(eventId),
    );
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="agremiados-general.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Exportar EventFile en formato UTILES DELEGADOS' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'eventFileId', type: String, format: 'uuid' })
  @Get('export-formatted/:eventFileId')
  async exportByEventFileFormatted(
    @Param('eventFileId') eventFileId: string,
    @Res() res: Response,
  ) {
    const { buffer, delegationName } = await lastValueFrom(
      this.eventMemberExcelService.generateByEventFileFormatted(eventFileId),
    );
    const filename = `formato-utiles-${delegationName}.xlsx`;
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Exportar agremiados de un EventFile a Excel' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'eventFileId', type: String, format: 'uuid' })
  @Get('export/:eventFileId')
  async exportByEventFile(
    @Param('eventFileId') eventFileId: string,
    @Res() res: Response,
  ) {
    const { buffer, delegationName } = await lastValueFrom(
      this.eventMemberExcelService.generateByEventFile(eventFileId),
    );
    const filename = `agremiados-${delegationName}.xlsx`;
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
