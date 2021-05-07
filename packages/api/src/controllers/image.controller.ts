import { Body, Controller, Get, HttpCode, Param, Post, Req, Res } from '@nestjs/common';
import { ImportImageRequest } from '../models/request-models';
import { Request, Response } from 'express';
import { S3Api } from '../s3-api';

@Controller('/api/images')
export class ImageController {
  constructor(private s3Api: S3Api) {
  }

  @Post('upload/:trackUri')
  @HttpCode(204)
  async uploadImage(@Param('trackUri') trackUri: string, @Req() request: Request) {
    const contentType = request.headers['content-type'];
    const contentSize = parseInt(request.headers['content-length'], 10);

    console.log(`uploading image with contentType ${contentType} and size ${contentSize}`)

    await this.s3Api.uploadImage(trackUri, contentType, contentSize, request);
  }

  @Post('import')
  importImage(@Body() request: ImportImageRequest) {
    console.log(request);
  }

  @Get(':trackUri')
  async getImage(@Param('trackUri') trackUri: string, @Res() response: Response) {
    const stream = await this.s3Api.getImage(trackUri);
    stream.pipe(response);
  }
}
