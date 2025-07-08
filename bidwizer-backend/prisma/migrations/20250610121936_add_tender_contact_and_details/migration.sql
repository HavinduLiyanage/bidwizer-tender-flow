-- AlterTable
ALTER TABLE "Tender" ADD COLUMN     "category" TEXT,
ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "contactPersonName" TEXT,
ADD COLUMN     "preBidMeetingDate" TIMESTAMP(3),
ADD COLUMN     "preBidMeetingTime" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "value" TEXT;

ALTER TABLE "User" ADD COLUMN     "position" TEXT;
ALTER TABLE "User" ADD COLUMN     "confirmToken" TEXT;
