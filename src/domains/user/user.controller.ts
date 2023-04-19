import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { ApiOkResponseTemplate } from '../../core/swagger/api-ok-response';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import HttpResponse from 'src/core/http/http-response';
import DeleteUserDto from './dtos/delete-user.dto';
import { CheckNicknameDto } from './dtos/check-nickname.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { UserInfoResponseDto } from './dtos/user-info-response.dto';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { VerifyEmailResponseDto } from './dtos/verify-email-response.dto';
import { FindPasswordDto } from './dtos/find-password.dto';

@ApiTags(SwaggerTag.USER)
@ApiCommonErrorResponseTemplate()
@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입은 유저를 생성하는 것이므로 POST 응답인 201 리턴함.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponseTemplate({ description: '생성한 유저 인덱스 리턴' })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.CONFLICT,
      errorFormatList: [
        HttpErrorConstants.EXIST_EMAIL,
        HttpErrorConstants.EXIST_NICKNAME,
      ],
    },
  ])
  @Post()
  async createUser(@Res() res, @Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return HttpResponse.created(res, { body: user.idx });
  }

  @ApiOperation({
    summary: '가입 인증 이메일 전송',
    description: '회원가입시 이메일 인증을 한다.',
  })
  @ApiBody({ type: VerifyEmailDto })
  @ApiCreatedResponseTemplate({ type: VerifyEmailResponseDto })
  @Post('/email-verify')
  async verifyEmail(@Res() res, @Body() dto: VerifyEmailDto) {
    const signupVerifyToken = await this.userService.sendMemberJoinEmail(
      dto.email,
    );
    console.log('signupVerifyToken:::', signupVerifyToken);
    return HttpResponse.ok(res, signupVerifyToken);
  }

  @ApiOperation({
    summary: '회원 정보 조회',
    description: '현재 로그인 중인 회원의 정보를 조회한다.',
  })
  @ApiOkResponseTemplate({ type: UserInfoResponseDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @UseAuthGuards()
  @Get('/me')
  async getUserInfo(@Res() res, @AuthUser() user: User) {
    const userInfo = await this.userService.getUserInfo(user.idx);
    return HttpResponse.ok(res, userInfo);
    // return res.status(200).send(userInfo);
  }

  @ApiOperation({
    summary: '회원 정보 수정',
    description: '현재 로그인 중인 회원의 정보를 수정한다.',
  })
  @ApiOkResponseTemplate({ type: UserInfoResponseDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @UseAuthGuards()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UpdateUserDto })
  @Patch()
  async update(
    @Res() res,
    @Body() dto: UpdateUserDto,
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userInfo = await this.userService.update(file, dto, user.idx);
    return HttpResponse.ok(res, userInfo);
  }

  @ApiOperation({
    summary: '닉네임 중복 확인',
    description: '회원 정보 수정 화면에서 닉네임 중복 확인을한다.',
  })
  @ApiOkResponseTemplate({ description: '중복이면 true, 아니면 false 리턴' })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.CONFLICT,
      errorFormatList: [HttpErrorConstants.EXIST_NICKNAME],
    },
  ])
  @UseAuthGuards()
  @ApiBody({ type: CheckNicknameDto })
  @Patch('/nickname')
  async existNickname(@Res() res, @Body() dto: CheckNicknameDto) {
    const isExist = await this.userService.checkExistNickname(dto.nickname);
    return HttpResponse.ok(res, isExist);
  }

  @ApiOperation({
    summary: '비밀번호 수정',
    description: '현재 비밀번호 입력 후 비밀번호를 변경한다.',
  })
  @ApiOkResponseTemplate()
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [
        HttpErrorConstants.CANNOT_FIND_USER,
        HttpErrorConstants.INVALID_AUTH,
      ],
    },
  ])
  @UseAuthGuards()
  @ApiBody({ type: UpdatePasswordDto })
  @Patch('/password')
  async updatePassword(
    @Res() res,
    @Body() dto: UpdatePasswordDto,
    @AuthUser() user: User,
  ) {
    await this.userService.updatePassword(user.idx, dto);
    return HttpResponse.ok(res);
  }

  @ApiOperation({
    summary: '비밀번호 찾기',
    description: '이메일 인증 후 새로운 비밀번호를 설정한다.',
  })
  @ApiOkResponseTemplate()
  @ApiBody({ type: FindPasswordDto })
  @Post('/find-password')
  async findPassword(@Res() res, @Body() dto: FindPasswordDto) {
    await this.userService.findPassword(dto);
    return HttpResponse.ok(res);
  }

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '비밀번호를 입력하여 회원 탈퇴한다. ',
  })
  @ApiOkResponseTemplate()
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [
        HttpErrorConstants.CANNOT_FIND_USER,
        HttpErrorConstants.INVALID_AUTH,
      ],
    },
  ])
  @UseAuthGuards()
  @ApiBody({ type: DeleteUserDto })
  @Delete()
  async remove(@Res() res, @Body() dto: DeleteUserDto, @AuthUser() user: User) {
    await this.userService.removeByPassword(dto, user.idx);
    return HttpResponse.ok(res);
  }
}
