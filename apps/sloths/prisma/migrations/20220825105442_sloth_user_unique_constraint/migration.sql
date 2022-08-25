/*
  Warnings:

  - A unique constraint covering the columns `[slothId,userId]` on the table `SlothUserRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SlothUserRating_slothId_userId_key" ON "SlothUserRating"("slothId", "userId");
