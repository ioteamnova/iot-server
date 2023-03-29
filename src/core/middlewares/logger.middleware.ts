import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(''); //http 관련 로거

  use(req: Request, res: Response, next: NextFunction): void {
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${userAgent} - ${req.method} ${res.statusCode} `,
        req.originalUrl,
      );
    });

    next();
  }
}
