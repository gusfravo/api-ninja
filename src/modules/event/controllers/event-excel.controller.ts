import { ExecuteEventExcel } from '@event/dto/execute-event-excel.dto';
import { ProccessEventExcel } from '@event/dto/proccess-event-excel.dto';
import { EventExcel } from '@event/entity/event-excel.entity';
import { EventExcelService } from '@event/services';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Event Excel')
@Controller('eventExcel')
export class EventExcelController {
  constructor(private readonly eventExcelService: EventExcelService) {}

  @ApiOperation({ summary: 'Metodo para ver el listado de pestañas de excel' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: ExecuteEventExcel,
  })
  @Post('getSheets')
  @UsePipes(new ValidationPipe())
  getSheets(@Body() object: ExecuteEventExcel) {
    return this.eventExcelService.onGetSheetsFromExcel(object.eventId);
  }

  @ApiOperation({ summary: 'Metodo para crear un nuevo evento de tomar datos' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: ProccessEventExcel,
  })
  @UsePipes(new ValidationPipe())
  @Post('execute')
  executeEvent(@Body() data: ProccessEventExcel) {
    return this.eventExcelService.onProcessExcel(data.eventId, data.sheetName);
  }

  @ApiOperation({
    summary: 'Metodo para saber si este metodo tien excel cargado',
  })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: EventExcel,
  })
  @UsePipes(new ValidationPipe())
  @Post('findByEvent')
  findByEvent(@Body() data: ExecuteEventExcel) {
    return this.eventExcelService.findByEvent(data.eventId);
  }
}
