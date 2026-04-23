import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PricingModule } from 'src/pricing/pricing.module';

@Module({
  imports: [PrismaModule, PricingModule],
  providers: [TripsService],
  controllers: [TripsController]
})
export class TripsModule {}
