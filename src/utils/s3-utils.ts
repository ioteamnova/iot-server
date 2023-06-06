import { BadRequestException } from '@nestjs/common';
import AWS, { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { logger } from './logger';
import DateUtils from './date-utils';
import * as uuid from 'uuid';

export const s3 = new S3({
  accessKeyId: process.env.AWS_ACECSS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

export const asyncUploadToS3 = async (
  fileKey: string,
  file: Buffer,
): Promise<ManagedUpload.SendData> => {
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
        Body: file,
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
