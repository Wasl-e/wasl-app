import { Module } from '@nestjs/common';
import { TripsService } from '../trips.service';
import { TripsController } from './trips.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TripsService],
  controllers: [TripsController]
})
export class TripsModule {}
