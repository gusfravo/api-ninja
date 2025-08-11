import { ExecuteEventExcel } from '@event/dto/execute-event-excel.dto';
import { ResponseUploadEventFile } from '@event/dto/ResponseUploadFileEvent.dto';
import { UpdateEvent } from '@event/dto/update-event.dto';
import { UploadFileEventDto } from '@event/dto/upload-file-event.dto';
import { EventExcelService } from '@event/services';
import { EventService } from '@event/services/event.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { throwError } from 'rxjs';

@ApiTags('Events')
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventExcelService: EventExcelService,
  ) { }

  @ApiOperation({ summary: 'Metodo para crear un nuevo evento de tomar datos' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: UpdateEvent,
  })
  @ApiResponse({
    type: Event,
  })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() object: UpdateEvent) {
    return this.eventService.onUpdate(object);
  }

  @ApiOperation({ summary: 'Metodo para crear un nuevo evento de tomar datos' })
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data') // Indicate multipart/form-data content type
  @ApiBody({
    type: UploadFileEventDto,
    /*
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Essential for Swagger to render a file upload input
        },

        // Add other properties if you're sending additional data with the file
        // e.g., description: { type: 'string' },
      },
    },*/
  })
  @ApiResponse({
    type: ResponseUploadEventFile,
  })
  @UsePipes(new ValidationPipe())
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UploadFileEventDto,
  ) {
    if (!file)
      return throwError(
        () =>
          new InternalServerErrorException(
            'Subo un documento antes de continuar',
          ),
      );
    return this.eventExcelService.create({
      file,
      eventId: data.eventId,
    });
  }

  @ApiOperation({ summary: 'Metodo para crear un nuevo evento de tomar datos' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: ExecuteEventExcel,
  })
  @UsePipes(new ValidationPipe())
  @Post('execute')
  executeEvent(@Body() data: ExecuteEventExcel) {
    return this.eventExcelService.processExcel(data.eventId);
  }
}
