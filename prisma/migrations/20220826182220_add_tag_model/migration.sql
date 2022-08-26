-- CreateTable
CREATE TABLE "Tag" (
    "slothId" UUID NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slothId_value_key" ON "Tag"("slothId", "value");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_slothId_fkey" FOREIGN KEY ("slothId") REFERENCES "Sloth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
