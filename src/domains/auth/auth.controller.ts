import { ApiCreatedResponseTemplate } from './../../core/swagger/api-created-response';
import HttpResponse from 'src/core/http/http-response';
import { AuthService } from './auth.service';
import { SwaggerTag } from '../../core/swagger/swagger-tags';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { SocialLoginUserDto } from './dtos/social-login-user.dto';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { LoginResponseDto } from './dtos/login-response.dto';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';

@ApiTags(SwaggerTag.AUTH)
@ApiCommonErrorResponseTemplate()
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
  @ApiCreatedResponseTemplate({ type: LoginResponseDto })
  @Post()
  async login(@Res() res, @Body() dto: LoginUserDto) {
    const result = await this.authService.login(dto);
    return HttpResponse.ok(res, result);
    // return res.status(201).send(result);
  }

  @ApiOperation({
    summary: '소셜 로그인',
    description: `소셜 로그인을 한다. 응답은 token값을 반환한다.`,
  })
  @ApiBody({
    type: SocialLoginUserDto,
  })
  @ApiCreatedResponseTemplate({ type: LoginResponseDto })
  @Post('/social')
  async socialLogin(@Res() res, @Body() dto: SocialLoginUserDto) {
    const result = await this.authService.socialLogin(dto);
    return HttpResponse.ok(res, result);
  }
}
