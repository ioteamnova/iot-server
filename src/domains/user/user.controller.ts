import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerTag } from 'src/core/swagger/api-tags';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from 'src/core/decorators/auth-user.decorator';

@ApiTags(SwaggerTag.USER)
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
  @ApiCreatedResponse({ description: '유저를 생성한다.' })
  // todo: ErrorResponse
  // @HttpCode(201)
  @Post()
  async createUser(@Res() res, @Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userService.createUser(dto);
    return res.status(201).send(user);
  }

  @ApiOperation({
    summary: '가입 인증 이메일 전송',
    description: '회원가입시 이메일 인증을 한다.',
  })
  @ApiBody({ type: VerifyEmailDto })
  @ApiCreatedResponse({ description: '이메일 인증' })
  @Post('/email-verify')
  async verifyEmail(
    @Res() res,
    @Body() dto: VerifyEmailDto,
  ): Promise<{ signupVerifyToken: string }> {
    const signupVerifyToken = await this.userService.sendMemberJoinEmail(
      dto.email,
    );
    console.log('signupVerifyToken:::', signupVerifyToken);
    return res.status(201).send(signupVerifyToken);
  }

  @ApiOperation({
    summary: '회원 정보 조회',
    description: '현재 로그인 중인 회원의 정보를 조회한다.',
  })
  @UseAuthGuards()
  @Get('/me')
  async getUserInfo(@Res() res, @AuthUser() user: User) {
    const userInfo = await this.userService.getUserInfo(user.idx);
    return res.status(200).send(userInfo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
