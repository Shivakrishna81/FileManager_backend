import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [AuthModule, FileModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
