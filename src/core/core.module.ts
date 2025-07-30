import { Module } from '@nestjs/common';
import { dataBaseProvider } from './modules/providers/data-store.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(dataBaseProvider),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        global: true,
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [JwtService],
  exports: [ConfigModule, JwtModule],
})
export class CoreModule {}
