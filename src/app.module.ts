import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './services/customer/customer.module';
import { AuthModule } from './services/auth/auth.module';

@Module({
  imports: [CustomerModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
