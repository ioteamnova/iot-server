import { AuthService } from './auth.service';
import { SwaggerTag } from './../../core/swagger/api-tags';
import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { logger } from 'src/utils/logger';
import LoginUserDto from './dtos/login-user.dto';

@ApiTags(SwaggerTag.AUTH)
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: `로그인을 한다. 응답은 token값을 반환한다.
    - 이메일/비밀번호로 로그인을 시도하여, 엑세스토큰을 발급한다.
    - 엑세스토큰을 생성하는(create) 행위이기 때문에, POST 로 정의한다.`,
  })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiCreatedResponse({ description: '로그인 성공, 토큰 값 발급' })
  @Post()
  async login(@Res() res, @Body() dto: LoginUserDto) {
    const token = await this.authService.login(dto);
    logger.info('token::', token);
    return res.status(201).send(token);
  }
}
