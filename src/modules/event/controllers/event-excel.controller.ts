import { ExecuteEventExcel } from '@event/dto/execute-event-excel.dto';
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
}
