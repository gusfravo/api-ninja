import { BenefitResponse } from '@benefit/dto/benefit-response.dto';
import { BenefitService } from '@benefit/service/benefit.service';
import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
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
}
