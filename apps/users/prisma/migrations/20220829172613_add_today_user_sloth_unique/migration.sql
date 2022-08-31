/*
  Warnings:

  - A unique constraint covering the columns `[slothId,userId]` on the table `TodayUserSloth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TodayUserSloth_slothId_userId_key" ON "TodayUserSloth"("slothId", "userId");
