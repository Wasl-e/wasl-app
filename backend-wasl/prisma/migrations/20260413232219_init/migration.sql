-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING', 'EN_ROUTE', 'DELIVERED');

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "departureSite" TEXT NOT NULL,
    "arrivalSite" TEXT NOT NULL,
    "availableFromDate" TIMESTAMP(3) NOT NULL,
    "availableFromTime" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "comment" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
