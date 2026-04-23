import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripStatus } from '@prisma/client';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}

  // CREATE
  async create(data: any) {
    const departureSite = data.departureSite?.trim();
    const arrivalSite = data.arrivalSite?.trim();

    return this.prisma.trip.create({
      data: {
        ...data,
        departureSite,
        arrivalSite,
        availableFromDate: data.availableFromDate
          ? new Date(data.availableFromDate)
          : null,
        latestDeliveryDate: data.latestDeliveryDate
          ? new Date(data.latestDeliveryDate)
          : null,
        latestDeliveryTime: data.latestDeliveryTime || null,
        driverName: data.driverName || null,
        amountHt: data.amountHt ?? null,
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

  update(id: number, data: any) {
    return this.prisma.trip.update({
      where: { id },
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
        amountHt:
          data.amountHt !== undefined && data.amountHt !== ""
            ? Number(data.amountHt)
            : null,
      },
    });
  }

  // DELETE
  delete(id: number) {
    return this.prisma.trip.delete({
      where: { id },
    });
  }
}