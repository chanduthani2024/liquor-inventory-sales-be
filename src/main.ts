import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS before any other middleware
  app.enableCors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // Add manual OPTIONS handler to ensure preflight requests work
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Origin');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Listen on all network interfaces
  await app.listen(3001, '0.0.0.0');
  
  console.log('🍷 Wine Shop Backend Started Successfully!');
  console.log('🔗 Local: http://localhost:3001');
  console.log('🌐 Network: http://43.204.130.122:3001');
  console.log('🔒 CORS: Enabled for all origins');
  console.log('⚡ Health Check: http://43.204.130.122:3001/health');
}
bootstrap();