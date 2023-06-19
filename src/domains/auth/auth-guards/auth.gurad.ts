import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/domains/user/entities/user.entity';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return !!user;
  }
}
