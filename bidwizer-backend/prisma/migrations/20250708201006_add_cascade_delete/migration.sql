-- DropForeignKey
ALTER TABLE "BidderProfile" DROP CONSTRAINT "BidderProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "PublisherProfile" DROP CONSTRAINT "PublisherProfile_userId_fkey";

-- AddForeignKey
ALTER TABLE "BidderProfile" ADD CONSTRAINT "BidderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublisherProfile" ADD CONSTRAINT "PublisherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
