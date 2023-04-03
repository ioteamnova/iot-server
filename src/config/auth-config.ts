import { registerAs } from '@nestjs/config';
import { jwtConstants } from 'src/domains/auth/auth-guards/jwt.constants';

export default registerAs('auth', () => ({
  jwtSecret: jwtConstants.secret,
}));
