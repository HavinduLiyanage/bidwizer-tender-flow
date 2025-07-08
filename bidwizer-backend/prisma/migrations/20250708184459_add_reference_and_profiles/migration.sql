-- AlterTable
ALTER TABLE "Tender" ADD COLUMN     "chunkEmbeddings" TEXT;

-- CreateTable
CREATE TABLE "BidderProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "position" TEXT,

    CONSTRAINT "BidderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublisherProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "position" TEXT,

    CONSTRAINT "PublisherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceEmbedding" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" BYTEA NOT NULL,

    CONSTRAINT "ReferenceEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BidderProfile_userId_key" ON "BidderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PublisherProfile_userId_key" ON "PublisherProfile"("userId");

-- AddForeignKey
ALTER TABLE "BidderProfile" ADD CONSTRAINT "BidderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublisherProfile" ADD CONSTRAINT "PublisherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
