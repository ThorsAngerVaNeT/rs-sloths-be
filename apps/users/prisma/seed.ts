import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      id: 'cd86722d-e3cc-405c-9a46-8da7d7d2dfcf',
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
