import { Module } from '@nestjs/common';
import { dataBaseProvider } from './modules/providers/data-store.provider';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(dataBaseProvider),
  ],
  exports: [ConfigModule],
})
export class CoreModule { }
