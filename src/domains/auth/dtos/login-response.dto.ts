import { PickType } from '@nestjs/swagger';
import { SocialLoginUserDto } from './social-login-user.dto';

export class LoginResponseDto extends PickType(SocialLoginUserDto, [
  'accessToken',
] as const) {}
