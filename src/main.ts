import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend - allow network access
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Listen on all network interfaces
  await app.listen(3001, '0.0.0.0');
  console.log('Wine Shop Backend is running on http://0.0.0.0:3001');
  console.log('Network access: http://172.22.31.39:3001');
}
bootstrap();