import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
// import authConfig from 'src/config/authConfig';

interface User {
  idx: number;
  email: string;
  nickname: string;
}

// @Injectable()
// export class AuthService {
//     constructor(
//         @Inject(authConfig.KEY)
//     )
// }
