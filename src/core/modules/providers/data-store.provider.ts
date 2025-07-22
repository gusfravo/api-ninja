import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const dataBaseProvider: FactoryProvider[] = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configSerice: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307,
        username: configSerice.get<string>('DB_USERNAME'),
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
