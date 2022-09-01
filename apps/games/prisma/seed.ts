import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
