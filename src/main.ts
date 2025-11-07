import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  initSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Ninja Docs API')
    .setDescription('The Ninja API description')
    .setVersion('1.0')
    .addTag('ninja')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
};
