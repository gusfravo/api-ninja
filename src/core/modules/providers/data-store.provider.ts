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
    host: 'db',
    port: 3306,
    username: 'root',
    password: 'System@ONCO01',
    database: 'api_ninja',
    autoLoadEntities: true,
    synchronize: true,
  })
}
