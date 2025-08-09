import { UpdateEvent } from '@event/dto/update-event.dto';
import { EventService } from '@event/services/event.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

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
}
