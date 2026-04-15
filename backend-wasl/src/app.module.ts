import { Module } from '@nestjs/common';
import { AppController } from '.././dossier/app.controller';
import { TripsModule } from './trips/trips.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, TripsModule],
  controllers: [AppController],
})
export class AppModule {}