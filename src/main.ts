import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PipeNumericId } from './commom/pipes/transform-id.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(), new PipeNumericId());

  const configSwagger = new DocumentBuilder()
    .setTitle('API E-commerce')
    .setDescription('Documetação da API de E-commerce, para estudos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
  console.log('API port 3000');
}
bootstrap();
