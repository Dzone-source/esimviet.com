/**
 * Reset admin username & password – plain Node.js (no ts-node required)
 *
 * Usage:
 *   node scripts/reset-admin.cjs [username] [password]
 *   ADMIN_USERNAME=myuser ADMIN_PASSWORD=secret node scripts/reset-admin.cjs
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const username = process.argv[2] || process.env.ADMIN_USERNAME || 'admin';
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123';

async function main() {
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const hashed = await bcrypt.hash(password, 12);
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'admin' } });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { username, password: hashed, role: 'admin' },
    });
  } else {
    await prisma.user.create({
      data: { username, password: hashed, role: 'admin' },
    });
  }

  console.log('✅ Admin account updated');
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
