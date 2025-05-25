const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'boran tesisat' },
    update: {},
    create: {
      username: 'boran tesisat',
      email: 'borka@gmail.com',
      password: '123456789',
      phone: '5523348343',
      fullName: 'boran tesisat',
      address: '-',
      roleId: 0
    }
  });

  console.log('Admin kullanıcı oluşturuldu:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 