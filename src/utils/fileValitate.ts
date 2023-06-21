import { HttpException, HttpStatus } from '@nestjs/common';

export function fileValidates(files: Express.Multer.File[]) {
  if (files && files.length > 0) {
    const allowedFileTypes = /(?:png|jpeg|mov|mp4)$/i;
    const maxFileSize = 200 * 1024 * 1024; // 200MB

    for (const file of files) {
      if (!allowedFileTypes.test(file.originalname)) {
        throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
      }

      if (file.size > maxFileSize) {
        throw new HttpException(
          'File size exceeds the limit',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
export function fileValidate(file: Express.Multer.File) {
  if (file) {
    const allowedFileTypes = /(?:png|jpeg|mov|mp4)$/i;
    const maxFileSize = 200 * 1024 * 1024; // 200MB
    if (!allowedFileTypes.test(file.originalname)) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }

    if (file.size > maxFileSize) {
      throw new HttpException(
        'File size exceeds the limit',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
