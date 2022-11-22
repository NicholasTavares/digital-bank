import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  logging: true,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'westeros',
  database: 'postgres',
  synchronize: false,
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
});
