import { DependenceResponse } from '@dependence/dto/dependence-response.dto';
import { UpdateDependence } from '@dependence/dto/update-dependence.dto';
import { DependenceService } from '@dependence/service/dependence.service';
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

@ApiTags('Dependence')
@Controller('dependence')
export class DependenceController {
  constructor(private readonly dependenceService: DependenceService) {}

  @ApiOperation({
    summary: 'Metodo para obtener el listado de dependencias de gobierno',
  })
  @ApiBearerAuth('JWT')
  @ApiResponse({
    type: DependenceResponse,
  })
  @Get('list')
  @UsePipes(new ValidationPipe())
  list() {
    return this.dependenceService.onList();
  }

  @ApiOperation({ summary: 'Metodo para crear una dependencia' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: UpdateDependence,
  })
  @ApiResponse({
    type: DependenceResponse,
  })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() object: UpdateDependence) {
    return this.dependenceService.onUpdate(object);
  }

  @ApiOperation({ summary: 'Metodo para eliminar logicamente una dependencia' })
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'uuid',
    description: 'Dependence ID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    type: DependenceResponse,
  })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.dependenceService.onDelete(uuid);
  }

  @ApiOperation({ summary: 'Metodo para obtener una dependencia' })
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'uuid',
    description: 'Dependencia ID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    type: DependenceResponse,
  })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.dependenceService.onGet(uuid);
  }
}
