import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        trips: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        trips: true,
      },
    });
  }

  updateStatus(id: number, status: InvoiceStatus) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }

  async getSummary() {
    const invoices = await this.prisma.invoice.findMany();

    const totalFacture = invoices.reduce((sum, invoice) => sum + invoice.totalTtc, 0);
    const enAttente = invoices
      .filter((invoice) => invoice.status === 'PENDING')
      .reduce((sum, invoice) => sum + invoice.totalTtc, 0);
    const paye = invoices
      .filter((invoice) => invoice.status === 'PAID')
      .reduce((sum, invoice) => sum + invoice.totalTtc, 0);

    return {
      totalFacture,
      enAttente,
      paye,
    };
  }

  async create(data: { startDate: string; endDate: string; tripIds: number[] }) {
    if (!data.tripIds || data.tripIds.length === 0) {
      throw new BadRequestException('Aucune mission sélectionnée');
    }

    const trips = await this.prisma.trip.findMany({
      where: {
        id: {
          in: data.tripIds,
        },
      },
    });

    if (trips.length !== data.tripIds.length) {
      throw new BadRequestException('Certaines missions sont introuvables');
    }

    const totalHt = trips.reduce((sum, trip) => sum + (trip.amountHt || 0), 0);
    const taxAmount = totalHt * 0.2;
    const totalTtc = totalHt + taxAmount;

    const count = await this.prisma.invoice.count();
    const reference = this.generateReference(new Date(data.startDate), count + 1);

    const invoice = await this.prisma.invoice.create({
      data: {
        reference,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'PENDING',
        totalHt,
        taxAmount,
        totalTtc,
        trips: {
          connect: data.tripIds.map((id) => ({ id })),
        },
      },
      include: {
        trips: true,
      },
    });

    return invoice;
  }

  private generateReference(date: Date, index: number) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(index).padStart(3, '0');

    return `WASL-${year}-${month}-${sequence}`;
    }

  async remove(id: number) {
  // détacher les missions
  await this.prisma.trip.updateMany({
    where: { invoiceId: id },
    data: { invoiceId: null },
  });

  // supprimer la facture
  return this.prisma.invoice.delete({
    where: { id },
  });
  }
}