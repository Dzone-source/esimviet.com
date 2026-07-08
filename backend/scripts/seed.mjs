/**
 * Database seed – plain Node.js (no ts-node required)
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword, role: 'admin' },
    create: { username: 'admin', password: hashedPassword, role: 'admin' },
  });

  const settings = [
    { key: 'site_name', value: 'eSIM Global' },
    { key: 'contact_email', value: 'support@esimglobal.com' },
    { key: 'facebook', value: 'https://facebook.com/esimglobal' },
    { key: 'paypal_client_id', value: '' },
    { key: 'paypal_secret', value: '' },
    { key: 'logo', value: '/logo.png' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  const countries = [
    { name: 'Vietnam', slug: 'vietnam', flag: '🇻🇳', region: 'Asia', is_popular: true },
    { name: 'Japan', slug: 'japan', flag: '🇯🇵', region: 'Asia', is_popular: true },
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭', region: 'Asia', is_popular: true },
    { name: 'Singapore', slug: 'singapore', flag: '🇸🇬', region: 'Asia', is_popular: true },
    { name: 'United States', slug: 'united-states', flag: '🇺🇸', region: 'Americas', is_popular: true },
    { name: 'United Kingdom', slug: 'united-kingdom', flag: '🇬🇧', region: 'Europe', is_popular: true },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { slug: country.slug },
      update: {},
      create: country,
    });
  }

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
