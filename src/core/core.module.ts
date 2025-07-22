import { Module } from '@nestjs/common';
import { dataBaseProvider } from './modules/providers/data-store.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [...dataBaseProvider],
  exports: [ConfigModule],
})
export class CoreModule {}
