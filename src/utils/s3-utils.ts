import { BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { logger } from './logger';
import DateUtils from './date-utils';
import * as uuid from 'uuid';
import * as sharp from 'sharp';

export const s3 = new S3({
  accessKeyId: process.env.AWS_ACECSS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

export const asyncUploadToS3 = async (
  fileKey: string,
  file: Buffer,
): Promise<ManagedUpload.SendData> => {
  if (isPNG(file)) {
    const originalExtension = fileKey.split('.').pop(); // 파일의 원래 확장자 추출
    fileKey = fileKey.replace(`.${originalExtension}`, '.jpeg'); // 확장자 변경
    //file = await convertToJPEG(file);
  }
  //이미지 리사이징 (sharp라이브러리)
  const resizedFile = await sharp(file, { failOnError: false })
    .resize({ width: 500 }) // 원본 비율 유지하면서 width의 크기만 500으로 지정 후 리사이징
    .toBuffer();

  const bucket = process.env.AWS_BUCKET_NAME;
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACECSS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  return await s3
    .upload(
      {
        Bucket: bucket,
        Key: fileKey,
        Body: resizedFile,
      },
      async function (err, data) {
        console.log(err);
        if (err) {
          throw new BadRequestException('file is not properly uploaded');
        }
        logger.info(`file ${fileKey} uploaded successfully. ${data.Location}`);
      },
    )
    .promise();
};

export enum S3FolderName {
  PROFILE = 'profile',
  PET = 'pet',
  BOARD = 'board',
  DIARY = 'diary',
  REPLY = 'reply',
}

export const mediaUpload = async (
  file: Express.Multer.File,
  folder: string,
): Promise<string> => {
  const fileName = `${DateUtils.momentFile()}-${uuid.v4()}-${
    file.originalname
  }`;
  const fileKey = `${folder}/${fileName}`;
  const result = await asyncUploadToS3(fileKey, file.buffer);
  return result.Location;
};

// async function convertToJPEG(pngBuffer: Buffer): Promise<Buffer> {
//   const convertedImage = await sharp(pngBuffer).jpeg().toBuffer();
//   return convertedImage;
// }
function isPNG(file: Buffer): boolean {
  // 파일 시그니처를 검사하여 PNG 파일인지 확인합니다.
  // 예를 들어, PNG 파일 시그니처는 '89 50 4E 47 0D 0A 1A 0A'입니다.
  // 실제로는 더 정확한 검사를 위해 라이브러리를 사용하는 것이 좋습니다.
  const signature = file.slice(0, 8).toString('hex');
  return signature === '89504e470d0a1a0a';
}
