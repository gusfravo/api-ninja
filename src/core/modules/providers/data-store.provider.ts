import { FactoryProvider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const dataBaseProvider: TypeOrmModuleAsyncOptions =
{
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configSerice: ConfigService) => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307,
    username: configSerice.get<string>('DB_USERNAME'),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
  })
}
