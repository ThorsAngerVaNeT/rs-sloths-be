import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line max-lines-per-function
async function main() {
  await prisma.user.deleteMany();

  console.log('Seeding User...');

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

  await prisma.sloth.deleteMany();

  console.log('Seeding Sloth...');

  const sloth1 = await prisma.sloth.create({
    data: {
      id: '579281ea-d2f4-43c7-ac51-5b304c705fc0',
      caption: 'Sloth Scientist',
      description: 'Clever looking sloth',
      image_url: 'http://localhost:5173/memory-level-middle.png',
    },
  });
  console.log('sloth1: ', sloth1);

  const sloth2 = await prisma.sloth.create({
    data: {
      id: 'f2c34cee-4208-4b91-a404-c85f813c01b2',
      caption: 'Sloth Superman',
      description: 'Sloth Superman',
      image_url: 'http://localhost:5173/memory-level-senior.png',
    },
  });
  console.log('sloth2: ', sloth2);

  const tag1 = await prisma.tag.create({
    data: {
      slothId: '579281ea-d2f4-43c7-ac51-5b304c705fc0',
      value: 'mentor',
    },
  });
  console.log('tag1: ', tag1);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
