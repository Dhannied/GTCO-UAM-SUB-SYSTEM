import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // ✅ Enable CORS once
  app.enableCors({
    origin: 'https://gtco-uam-sub-system.vercel.app', // or explicitly put your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Global validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('UAM Centralized Deactivation System API')
    .setDescription('API documentation for UAM Centralized Deactivation System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // ✅ Start server
  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
