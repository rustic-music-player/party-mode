import { Injectable } from '@nestjs/common';
import { Config } from './config';
import { Client } from 'minio';
import { Readable } from 'stream';

const IMAGES_BUCKET = 'images';

@Injectable()
export class S3Api {
  private client: Client;
  private createdBucket = false;

  constructor(private config: Config) {
    this.client = new Client({
      endPoint: config.storage.host,
      port: config.storage.port,
      accessKey: config.storage.accessKey,
      secretKey: config.storage.secretKey,
      useSSL: config.storage.useSSL,
    });
  }

  async uploadImage(trackUrl: string, contentType: string, contentSize: number, stream) {
    const bucket = await this.getImageBucket();
    if (await this.hasFile(bucket, trackUrl)) {
      return;
    }
    await this.uploadFile(bucket, trackUrl, stream, contentSize, contentType);
  }

  async getImage(trackUri: string): Promise<Readable> {
    const bucket = await this.getImageBucket();
    return await this.client.getObject(bucket, trackUri);
  }

  private async uploadFile(bucket: string, trackUrl: string, stream, contentSize: number, contentType: string) {
    await this.client.putObject(bucket, trackUrl, stream, contentSize, {
      'Content-Type': contentType,
    });
  }

  private async hasFile(bucket: string, trackUrl: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, trackUrl);
      return true;
    }catch (err) {
      return false;
    }
  }

  private async getImageBucket(): Promise<string> {
    if (!this.createdBucket && !(await this.client.bucketExists(IMAGES_BUCKET))) {
      await this.client.makeBucket(IMAGES_BUCKET, 'eu-west-1');
    }
    this.createdBucket = true;
    return IMAGES_BUCKET;
  }
}
