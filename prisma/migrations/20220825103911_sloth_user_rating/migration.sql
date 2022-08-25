/*
  Warnings:

  - The primary key for the `Sloth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Sloth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Sloth" DROP CONSTRAINT "Sloth_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Sloth_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "SlothUserRating" (
    "id" TEXT NOT NULL,
    "slothId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlothUserRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlothUserRating" ADD CONSTRAINT "SlothUserRating_slothId_fkey" FOREIGN KEY ("slothId") REFERENCES "Sloth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
