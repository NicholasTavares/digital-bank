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
    autoLoadEntities: true, // TODO remove in deploy
    synchronize: true, // TODO remove in deploy
    entities: ['dist/src/**/entities/*.entity{.ts,.js}'],
    migrations: ['../shared/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: '../shared/migrations',
    },
  };
});
