import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('health')
export class HealthController {
  @Get()
  check(@Req() request: Request) {
    return {
      status: 'OK',
      message: 'Wine Shop Backend is running',
      timestamp: new Date().toISOString(),
      cors: 'enabled',
      headers: {
        origin: request.headers.origin,
        host: request.headers.host,
        userAgent: request.headers['user-agent'],
        referer: request.headers.referer
      }
    };
  }
}