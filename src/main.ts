import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { backendServer } from '#src/common/configs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '#src/common/exception-handler/exception.filter';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://helper-frontend.vercel.app',
      'https://helper-modal.vercel.app',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  app.useBodyParser('urlencoded', { limit: '100mb' });
  app.useBodyParser('json', { limit: '100mb' });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enable('trust proxy');
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Inverse Chat Helper')
    .setDescription('by Inverse.Production')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(backendServer.port);
}

bootstrap();
