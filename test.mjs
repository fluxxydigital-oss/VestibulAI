import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user');
      return;
    }
    const userId = user.id;
    console.log('User id:', userId);

    console.log('Testing targetDate update...');
    await prisma.user.update({
      where: { id: userId },
      data: { targetDate: new Date('2026-11-20') }
    });
    console.log('Update success!');
  } catch(e) {
    console.log('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
