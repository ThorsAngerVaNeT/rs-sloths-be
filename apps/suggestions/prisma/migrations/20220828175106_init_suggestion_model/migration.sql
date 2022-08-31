-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINE');

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuggestionUserRating" (
    "id" TEXT NOT NULL,
    "suggestionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestionUserRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuggestionUserRating_suggestionId_userId_key" ON "SuggestionUserRating"("suggestionId", "userId");

-- AddForeignKey
ALTER TABLE "SuggestionUserRating" ADD CONSTRAINT "SuggestionUserRating_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "Suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
