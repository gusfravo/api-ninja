import { MemberService } from '@member/service/member.service';
import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Members')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: 'Buscar miembros por nombre' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'name', type: String })
  @Get('list-by-name/:name')
  @UsePipes(new ValidationPipe())
  listByName(@Param('name') name: string) {
    return this.memberService.onListByName({ name });
  }
}
