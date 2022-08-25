import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      name: 'Admin',
      github: 'test',
      avatar_url: 'https://avatars.githubusercontent.com/u/101447709?v=4',
      role: 'ADMIN',
    },
  });

  console.log('user1: ', user1);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
