import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(data: any) {
    return this.prisma.trip.create({
      data: {
        ...data,
        availableFromDate: data.availableFromDate
          ? new Date(data.availableFromDate)
          : null,
        latestDeliveryDate: data.latestDeliveryDate
          ? new Date(data.latestDeliveryDate)
          : null,
        latestDeliveryTime: data.latestDeliveryTime || null,
        driverName: data.driverName || null,
      },
    });
  }

  // GET ALL
  findAll() {
    return this.prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.trip.findUnique({
      where: { id },
    });
  }

  // UPDATE STATUS
  updateStatus(id: number, status: TripStatus) {
    return this.prisma.trip.update({
      where: { id },
      data: { status },
    });
  }

  // DELETE
  delete(id: number) {
    return this.prisma.trip.delete({
      where: { id },
    });
  }
}