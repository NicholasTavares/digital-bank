import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupDocumentation = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Digital Bank API')
    .setDescription('Digital Bank API endpoints documentation.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  delete document.components.schemas;

  SwaggerModule.setup('documentation', app, document);
};
