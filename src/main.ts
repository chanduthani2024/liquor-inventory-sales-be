import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend - allow network access
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://43.204.130.122:3000',
      'http://43.204.130.122:5000',
      'http://43.204.130.122',
      '*' // Allow all origins in production (you can restrict this later)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Listen on all network interfaces
  await app.listen(3001, '0.0.0.0');
  console.log('Wine Shop Backend is running on http://0.0.0.0:3001');
  console.log('Network access: http://43.204.130.122:3001');
}
bootstrap();