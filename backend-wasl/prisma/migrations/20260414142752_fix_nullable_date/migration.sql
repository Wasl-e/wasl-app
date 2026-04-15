-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "latestDeliveryDate" TIMESTAMP(3),
ALTER COLUMN "availableFromDate" DROP NOT NULL;
