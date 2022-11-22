import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    logging: true,
    host: process.env.DB_MAIN_HOST,
    port: process.env.DB_MAIN_PORT,
    username: process.env.DB_MAIN_USER,
    password: process.env.DB_MAIN_PASSWORD,
    database: process.env.DB_MAIN_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    entities: ['dist/src/modules/**/entities/*.entity.js'],
    migrations: ['dist/src/migrations/*.js'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
});
