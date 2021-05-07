import { Injectable } from '@nestjs/common';

@Injectable()
export class Config {
  storage = new StorageConfig();
}

export class StorageConfig {
  host: string = process.env.S3_HOST;
  port = 9000;
  useSSL = false;
  accessKey: string = process.env.S3_ACCESS_KEY;
  secretKey: string = process.env.S3_SECRET_KEY;
}
