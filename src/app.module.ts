import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { NinjaModule } from './modules/ninja.module';

@Module({
  imports: [CoreModule, NinjaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
