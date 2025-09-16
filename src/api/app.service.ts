import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AllExceptionFilter } from 'src/infrastructure/exception/AllException.filter';
import { config } from '../config/index';

const { PORT } = config;

export class Aplication {
  static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    // VALIDATION
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    app.useGlobalFilters(new AllExceptionFilter());
    app.use(cookieParser());
    const api: string = 'api/v1';

    app.setGlobalPrefix(api);

    //SWAGGER
    const config = new DocumentBuilder()
      .setTitle('Azizbek')
      .setDescription('Azizbek 4- Imtihon')
      .setVersion('1.0')
      .addTag('Azizbek')
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(api, app, documentFactory);

    await app.listen(PORT, () => console.log('server runnig onn port', PORT));
  }
}
