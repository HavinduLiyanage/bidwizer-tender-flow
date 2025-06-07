const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Publisher One',
        email: 'publisher@bidwizer.com',
        password: 'test123', // In production, hash this!
        role: 'publisher',
        status: 'active'
      },
      {
        name: 'Bidder One',
        email: 'bidder@bidwizer.com',
        password: 'test123',
        role: 'bidder',
        status: 'active'
      }
    ],
    skipDuplicates: true
  });
}

main().then(() => prisma.$disconnect());
