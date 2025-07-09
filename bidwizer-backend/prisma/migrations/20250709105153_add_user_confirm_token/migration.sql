-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmToken" TEXT,
ADD COLUMN     "confirmTokenExpiry" TIMESTAMP(3);
