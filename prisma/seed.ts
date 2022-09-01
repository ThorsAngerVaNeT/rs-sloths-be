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

  await prisma.tag.deleteMany();

  const tag1 = await prisma.tag.create({
    data: {
      slothId: '579281ea-d2f4-43c7-ac51-5b304c705fc0',
      value: 'mentor',
    },
  });
  console.log('tag1: ', tag1);

  await prisma.game.deleteMany();

  const createGames = await prisma.game.createMany({
    data: [
      { id: '36fdb508-80e4-4e0d-a6b8-78fe7e66a5d5', name: 'Memory Game - Junior' },
      { id: 'ca0305dc-9dab-4f36-84f1-45f8223818e0', name: 'Memory Game - Middle' },
      { id: '42df7648-5c56-4a66-a288-ec6acf8b18b0', name: 'Memory Game - Senior' },
      { id: '431b4880-0ac6-4082-ae9f-b34f5f9a84a6', name: 'Guess-a-Sloth Game' },
    ],
  });
  console.log('createGames: ', createGames);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
