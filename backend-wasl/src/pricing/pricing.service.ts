import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.pricingRoute.findMany({
      orderBy: [
        { departureSite: 'asc' },
        { arrivalSite: 'asc' },
      ],
    });
  }

  findRoutePrice(departureSite: string, arrivalSite: string) {
    return this.prisma.pricingRoute.findFirst({
      where: {
        departureSite: departureSite.trim(),
        arrivalSite: arrivalSite.trim(),
      },
    });
  }

  create(data: { departureSite: string; arrivalSite: string; amountHt: number }) {
    return this.prisma.pricingRoute.create({
      data: {
        departureSite: data.departureSite.trim(),
        arrivalSite: data.arrivalSite.trim(),
        amountHt: data.amountHt,
      },
    });
  }

  update(id: number, data: { departureSite?: string; arrivalSite?: string; amountHt?: number }) {
    return this.prisma.pricingRoute.update({
      where: { id },
      data: {
        ...(data.departureSite ? { departureSite: data.departureSite.trim() } : {}),
        ...(data.arrivalSite ? { arrivalSite: data.arrivalSite.trim() } : {}),
        ...(data.amountHt !== undefined ? { amountHt: data.amountHt } : {}),
      },
    });
  }

  remove(id: number) {
    return this.prisma.pricingRoute.delete({
      where: { id },
    });
  }
}