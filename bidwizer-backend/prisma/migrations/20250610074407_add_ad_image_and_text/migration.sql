/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tender` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tender" DROP COLUMN "createdAt",
ADD COLUMN     "advertisementImagePath" TEXT,
ADD COLUMN     "tenderText" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "filePath" DROP NOT NULL;
