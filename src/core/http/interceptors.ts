import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// export function setNestApp<T extends INestApplication>(app: T): void {
//   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
// }
