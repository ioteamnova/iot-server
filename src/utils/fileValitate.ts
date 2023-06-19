import {
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export function fileValidate() {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /(?:png|jpeg|mov|mp4)$/,
    })
    .addMaxSizeValidator({
      maxSize: 10000000, // 10mb.
    })
    .build({
      exceptionFactory(error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      },
    });
}
