import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend - allow network access
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://172.22.31.39:3000',
      'http://43.204.130.122:3001',
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/, // Any 192.168.x.x network
      /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/, // Any 172.x.x.x network
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/, // Any 10.x.x.x network
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Listen on all network interfaces
  await app.listen(3001, '0.0.0.0');
  console.log('Wine Shop Backend is running on http://0.0.0.0:3001');
  console.log('Network access: http://172.22.31.39:3001');
}
bootstrap();