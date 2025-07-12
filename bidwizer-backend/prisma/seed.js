const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // Create dummy company for bidder
  const company = await prisma.company.create({
    data: {
      name: 'Bidder Company',
      plan: 'BASIC',
    },
  });

  // Create dummy bidder
  const bidderPassword = await bcrypt.hash('bidder123', 10);
  const bidder = await prisma.user.create({
    data: {
      name: 'Bidder User',
      email: 'bidder@example.com',
      password: bidderPassword,
      role: 'BIDDER',
      status: 'ACTIVE',
      companyId: company.id,
      position: 'Manager',
    },
  });

  // Create dummy publisher
  const publisherPassword = await bcrypt.hash('publisher123', 10);
  const publisher = await prisma.user.create({
    data: {
      name: 'Publisher User',
      email: 'publisher@example.com',
      password: publisherPassword,
      role: 'PUBLISHER',
      status: 'ACTIVE',
      position: 'CEO',
    },
  });

  // Create dummy admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@bidwizer.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      position: 'Platform Admin',
    },
  });

  console.log('Seeded users:', { bidder, publisher, admin });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
