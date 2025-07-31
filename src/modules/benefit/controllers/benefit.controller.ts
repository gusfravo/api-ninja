import { BenefitResponse } from '@benefit/dto/benefit-response.dto';
import { UpdateBenefit } from '@benefit/dto/update-benefit.dto';
import { BenefitService } from '@benefit/service/benefit.service';
import {
  Body,
  Controller,
  Get,
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

@ApiTags('Benefits')
@Controller('benefit')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @ApiOperation({ summary: 'Metodo para obtener el listado de percepciones' })
  @ApiBearerAuth('JWT')
  @ApiResponse({
    type: BenefitResponse,
  })
  @Get('list')
  @UsePipes(new ValidationPipe())
  list() {
    return this.benefitService.onList();
  }

  @ApiOperation({ summary: 'Metodo para crear una prestación' })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: UpdateBenefit,
  })
  @ApiResponse({
    type: BenefitResponse,
  })
  @Post('update')
  @UsePipes(new ValidationPipe())
  update(@Body() object: UpdateBenefit) {
    return this.benefitService.onUpdate(object);
  }
}
