import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from '../src/trips/trips.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TripsModule, PrismaModule, UsersModule, AuthModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
