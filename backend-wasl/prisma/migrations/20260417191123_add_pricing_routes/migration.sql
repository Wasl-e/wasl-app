-- CreateTable
CREATE TABLE "PricingRoute" (
    "id" SERIAL NOT NULL,
    "departureSite" TEXT NOT NULL,
    "arrivalSite" TEXT NOT NULL,
    "amountHt" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingRoute_departureSite_arrivalSite_key" ON "PricingRoute"("departureSite", "arrivalSite");
