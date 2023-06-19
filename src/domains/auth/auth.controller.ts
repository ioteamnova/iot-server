import { JwtRefreshGuard } from './auth-guards/refresh-guard';
import { ApiCreatedResponseTemplate } from './../../core/swagger/api-created-response';
import HttpResponse from 'src/core/http/http-response';
import { AuthService } from './auth.service';
import { SwaggerTag } from '../../core/swagger/swagger-tags';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { SocialLoginUserDto } from './dtos/social-login-user.dto';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import UseAuthGuards from './auth-guards/use-auth';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';

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
    return HttpResponse.created(res, { body: result });
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
    return HttpResponse.created(res, { body: result });
  }

  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: `JWT 리프레시 토큰으로 액세스 토큰을 재발급 한다.`,
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiCreatedResponseTemplate({ type: LoginResponseDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
    {
      status: StatusCodes.UNAUTHORIZED,
      errorFormatList: [HttpErrorConstants.EXPIRED_REFRESH_TOKEN],
    },
  ])
  @UseGuards(JwtRefreshGuard)
  @Post('/token')
  async getNewAccessToken(@Res() res, @Body() dto: RefreshTokenDto) {
    const result = await this.authService.getNewAccessToken(dto.refreshToken);
    return HttpResponse.created(res, { body: result });
  }

  @ApiOperation({
    summary: '로그아웃',
    description: `로그아웃 한다.`,
  })
  @ApiCreatedResponseTemplate()
  @UseAuthGuards()
  @Get('/logout')
  async logout(@Res() res, @AuthUser() user: User) {
    await this.authService.logout(user.idx);
    return HttpResponse.ok(res);
  }
}
