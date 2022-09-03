/*
  Warnings:

  - You are about to drop the column `result` on the `GameResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameResult" DROP COLUMN "result",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "time" INTEGER;
