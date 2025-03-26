// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Invent@123',
  database: 'nest_auth',
  entities: [User],
  synchronize: true,
});
