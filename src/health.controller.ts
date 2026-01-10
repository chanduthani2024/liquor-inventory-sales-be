import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'OK',
      message: 'Wine Shop Backend is running',
      timestamp: new Date().toISOString(),
      cors: 'enabled'
    };
  }
}