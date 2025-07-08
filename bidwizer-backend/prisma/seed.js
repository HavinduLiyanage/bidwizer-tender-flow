const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bidderProfile.deleteMany();
  await prisma.publisherProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create dummy bidder
  const bidderPassword = await bcrypt.hash('bidder123', 10);
  const bidder = await prisma.user.create({
    data: {
      name: 'Bidder User',
      email: 'bidder@example.com',
      password: bidderPassword,
      role: 'bidder',
      status: 'active',
      bidderProfile: {
        create: {
          position: 'Manager',
        },
      },
    },
    include: { bidderProfile: true },
  });

  // Create dummy publisher
  const publisherPassword = await bcrypt.hash('publisher123', 10);
  const publisher = await prisma.user.create({
    data: {
      name: 'Publisher User',
      email: 'publisher@example.com',
      password: publisherPassword,
      role: 'publisher',
      status: 'active',
      publisherProfile: {
        create: {
          position: 'CEO',
        },
      },
    },
    include: { publisherProfile: true },
  });

  console.log('Seeded users:', { bidder, publisher });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
