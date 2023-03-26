import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupDocumentation = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Digital Bank API')
    .setDescription('Digital Bank API documentation.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);
};
