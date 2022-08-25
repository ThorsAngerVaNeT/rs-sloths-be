import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.sloth.deleteMany();

  console.log('Seeding Sloth...');

  const sloth1 = await prisma.sloth.create({
    data: {
      caption: 'Sloth Scientist',
      description: 'Clever looking sloth',
      image_url: 'http://localhost:5173/memory-level-middle.png',
    },
  });
  console.log('sloth1: ', sloth1);

  const sloth2 = await prisma.sloth.create({
    data: {
      caption: 'Sloth Superman',
      description: 'Sloth Superman',
      image_url: 'http://localhost:5173/memory-level-senior.png',
    },
  });
  console.log('sloth2: ', sloth2);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
