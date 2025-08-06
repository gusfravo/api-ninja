import { FilterListDelegation } from '@delegation/dto/filter-list-delegation.dto';
import { UpdateDelagation } from '@delegation/dto/update-delegation.dto';
import { Delegation } from '@delegation/entity/delegation.entity';
import { DelegationService } from '@delegation/service/delegation.service';
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

@ApiTags('Delegations')
@Controller('delegation')
export class DelegationController {
  constructor(private readonly delegationService: DelegationService) { }

  @ApiOperation({ summary: 'Metodo para listar los delegados ' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: FilterListDelegation,
  })
  @ApiResponse({
    type: Delegation,
    isArray: true,
  })
  @Post('list')
  @UsePipes(new ValidationPipe())
  list(@Body() listFilters: FilterListDelegation) {
    return this.delegationService.onList(listFilters);
  }

  @ApiOperation({ summary: 'Metodo para crear un delegado' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: UpdateDelagation,
  })
  @ApiResponse({
    type: Delegation,
  })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() object: UpdateDelagation) {
    return this.delegationService.onUpdate(object);
  }

  @ApiOperation({ summary: 'Metodo para eliminar logicamente una delegación' })
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'uuid',
    description: 'Delegation ID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    type: Delegation,
  })
  @Delete('delete/:uuid')
  @UsePipes(new ValidationPipe())
  delete(@Param('uuid') uuid: string) {
    return this.delegationService.onGet(uuid);
  }

  @ApiOperation({ summary: 'Metodo para obtener una delegación' })
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'uuid',
    description: 'Dependencia ID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    type: Delegation,
  })
  @Get('get/:uuid')
  @UsePipes(new ValidationPipe())
  get(@Param('uuid') uuid: string) {
    return this.delegationService.onGet(uuid);
  }
}
