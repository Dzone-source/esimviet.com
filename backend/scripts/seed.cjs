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
    { key: 'site_name', value: 'eSIM Viet' },
    { key: 'contact_email', value: 'support@esimviet.com' },
    { key: 'facebook', value: 'https://facebook.com/esimviet' },
    { key: 'paypal_client_id', value: '' },
    { key: 'paypal_secret', value: '' },
    { key: 'logo', value: '/logo.png' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  await prisma.country.updateMany({
    where: { slug: { not: 'vietnam' } },
    data: { is_active: false, is_popular: false },
  });
  await prisma.plan.updateMany({
    where: { country: { slug: { not: 'vietnam' } } },
    data: { is_active: false },
  });

  await prisma.country.updateMany({
    where: { slug: 'vietnam' },
    data: { cover_image: '/images/vietnam-hero.jpg' },
  });

  const vietnam = await prisma.country.upsert({
    where: { slug: 'vietnam' },
    update: {
      name: 'Vietnam',
      flag: '🇻🇳',
      region: 'Asia',
      is_popular: true,
      is_active: true,
      cover_image: '/images/vietnam-hero.jpg',
    },
    create: {
      name: 'Vietnam',
      slug: 'vietnam',
      flag: '🇻🇳',
      region: 'Asia',
      is_popular: true,
      is_active: true,
      cover_image: '/images/vietnam-hero.jpg',
    },
  });

  const vnPlans = [
    { title: 'Vietnam 3 Days', days: 3, data_amount: '3GB', price: 4.99, network: '4G/LTE', hotspot: true, speed: '100 Mbps', description: 'Perfect for short trips to Vietnam.' },
    { title: 'Vietnam 7 Days', days: 7, data_amount: '10GB', price: 8.99, network: '4G/LTE', hotspot: true, speed: '100 Mbps', description: 'Great for a week in Vietnam.' },
    { title: 'Vietnam 15 Days', days: 15, data_amount: '20GB', price: 14.99, network: '4G/LTE', hotspot: true, speed: '100 Mbps', description: 'Extended stay plan for Vietnam.' },
    { title: 'Vietnam 30 Days', days: 30, data_amount: 'Unlimited', price: 24.99, network: '4G/5G', hotspot: true, speed: '150 Mbps', description: 'Unlimited data for a full month in Vietnam.' },
  ];

  for (const plan of vnPlans) {
    const existing = await prisma.plan.findFirst({
      where: { country_id: vietnam.id, title: plan.title },
    });
    if (!existing) {
      await prisma.plan.create({ data: { ...plan, country_id: vietnam.id } });
    }
  }

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
