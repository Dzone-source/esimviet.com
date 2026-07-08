import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2] || 'admin123';
  const hashed = await bcrypt.hash(newPassword, 12);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashed,
      role: Role.admin,
    },
    create: {
      username: 'admin',
      password: hashed,
      role: Role.admin,
    },
  });

  console.log('✅ Admin account ready');
  console.log('   Username: admin');
  console.log(`   Password: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
