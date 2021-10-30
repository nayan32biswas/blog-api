import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(
    // Reference: https://docs.nestjs.com/techniques/validation#auto-validation
    new ValidationPipe({
      // Make sure that there's no unexpected data
      whitelist: true,
      // instructs NestJS to throw an exception if there are unexpected fields
      forbidNonWhitelisted: true,
      // unknown objects are immediately rejected
      forbidUnknownValues: true,
      // Detailed error messages since this is 4xx
      disableErrorMessages: false,
      validationError: {
        // WARNING: Avoid exposing the values in the error output (could leak sensitive information)
        value: false,
      },
      //  Transform the JSON into a class instance when possible.
      //  Depends on the type of the data on the controllers
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blog Endpoint')
    .setDescription('The Blog API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8000);
}
bootstrap();
