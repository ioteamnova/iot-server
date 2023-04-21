import { BadRequestException } from '@nestjs/common';
import AWS, { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { logger } from './logger';

const bucket = process.env.AWS_BUCKET_NAME;
export const s3 = new S3({
  accessKeyId: process.env.AWS_ACECSS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

export const asyncUploadToS3 = async (
  fileKey: string,
  file: Buffer,
): Promise<ManagedUpload.SendData> => {
  return await s3
    .upload(
      {
        Bucket: bucket,
        Key: fileKey,
        Body: file,
      },
      async function (err, data) {
        if (err) {
          throw new BadRequestException(err);
        }
        logger.info(`file ${fileKey} uploaded successfully. ${data.Location}`);
      },
    )
    .promise();
};

export enum S3FolderName {
  PROFILE = 'profile',
  PET = 'pet',
  DIARY = 'diary',
}
