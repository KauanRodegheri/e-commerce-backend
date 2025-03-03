import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PipeNumericId } from './commom/pipes/transform-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(), new PipeNumericId());
  await app.listen(process.env.PORT ?? 3000);
  console.log('API port 3000')
}
bootstrap();
