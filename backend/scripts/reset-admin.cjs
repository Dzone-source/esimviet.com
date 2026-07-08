/**
 * Reset admin password – plain Node.js (no ts-node required)
 * Usage: node scripts/reset-admin.cjs [new_password]
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const password = process.argv[2] || 'admin123';

async function main() {
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashed, role: 'admin' },
    create: { username: 'admin', password: hashed, role: 'admin' },
  });
  console.log('✅ Admin account ready');
  console.log('   Username: admin');
  console.log(`   Password: ${password}`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
