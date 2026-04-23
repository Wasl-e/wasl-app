import { Module } from '@nestjs/common';
import { AppController } from '.././dossier/app.controller';
import { TripsModule } from './trips/trips.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, TripsModule, InvoicesModule, PricingModule],
  controllers: [AppController],
})
export class AppModule {}