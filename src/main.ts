/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatErrors } from './utils/formatErros.util';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { setupDocumentation } from './common/documentation/build-swagger.document';
import * as os from 'os';
const cluster = require('node:cluster');
const numCPUs = os.cpus().length;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(FormatErrors(errors)),
    }),
  );
  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  if (process.env.API_MODE === 'DEV') {
    setupDocumentation(app);
  }

  await app.listen(process.env.APP_PORT || 5001);
}
if (cluster.isMaster) {
  console.log(`Master server started on ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting`);
    cluster.fork();
  });
} else {
  console.log(`Cluster server started on ${process.pid}`);
  bootstrap();
}
