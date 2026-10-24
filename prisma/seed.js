const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { roleid: 1 },
    update: {},
    create: { roleid: 1, rolename: 'Customer' },
  });
  await prisma.role.upsert({
    where: { roleid: 2 },
    update: {},
    create: { roleid: 2, rolename: 'Admin' },
  });

  await prisma.memberShip.upsert({
    where: { mid: 1 },
    update: {},
    create: { mid: 1, mname: 'Bronze', score: 0 },
  });

  console.log('✅ Nạp dữ liệu mẫu (Role, Membership) thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });