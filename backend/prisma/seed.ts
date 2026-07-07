import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: Role.admin,
    },
  });

  // Default settings
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

  // Countries
  const countries = [
    { name: 'Vietnam', slug: 'vietnam', flag: '🇻🇳', region: 'Asia', is_popular: true, cover_image: '/covers/vietnam.jpg' },
    { name: 'Japan', slug: 'japan', flag: '🇯🇵', region: 'Asia', is_popular: true, cover_image: '/covers/japan.jpg' },
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭', region: 'Asia', is_popular: true, cover_image: '/covers/thailand.jpg' },
    { name: 'Singapore', slug: 'singapore', flag: '🇸🇬', region: 'Asia', is_popular: true, cover_image: '/covers/singapore.jpg' },
    { name: 'United States', slug: 'united-states', flag: '🇺🇸', region: 'Americas', is_popular: true, cover_image: '/covers/usa.jpg' },
    { name: 'United Kingdom', slug: 'united-kingdom', flag: '🇬🇧', region: 'Europe', is_popular: true, cover_image: '/covers/uk.jpg' },
    { name: 'South Korea', slug: 'south-korea', flag: '🇰🇷', region: 'Asia', is_popular: false, cover_image: '/covers/korea.jpg' },
    { name: 'Australia', slug: 'australia', flag: '🇦🇺', region: 'Oceania', is_popular: false, cover_image: '/covers/australia.jpg' },
    { name: 'France', slug: 'france', flag: '🇫🇷', region: 'Europe', is_popular: false, cover_image: '/covers/france.jpg' },
    { name: 'Germany', slug: 'germany', flag: '🇩🇪', region: 'Europe', is_popular: false, cover_image: '/covers/germany.jpg' },
    { name: 'Indonesia', slug: 'indonesia', flag: '🇮🇩', region: 'Asia', is_popular: false, cover_image: '/covers/indonesia.jpg' },
    { name: 'Malaysia', slug: 'malaysia', flag: '🇲🇾', region: 'Asia', is_popular: false, cover_image: '/covers/malaysia.jpg' },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { slug: country.slug },
      update: {},
      create: country,
    });
  }

  // Plans for Vietnam
  const vietnam = await prisma.country.findUnique({ where: { slug: 'vietnam' } });
  if (vietnam) {
    const vnPlans = [
      { title: 'Vietnam 3 Days', days: 3, data_amount: '3GB', price: 4.99, network: '4G/LTE', hotspot: true, speed: '100 Mbps', description: 'Perfect for short trips to Vietnam. 3GB high-speed data.' },
      { title: 'Vietnam 7 Days', days: 7, data_amount: '10GB', price: 8.99, network: '4G/LTE', hotspot: true, speed: '100 Mbps', description: 'Great for a week in Vietnam. 10GB high-speed data.' },
      { title: 'Vietnam 15 Days', days: 15, data_amount: '20GB', price: 14.99, network: '4G/LTE', hotspot: true, speed: '100 Mbps', description: 'Extended stay plan. 20GB high-speed data.' },
      { title: 'Vietnam 30 Days', days: 30, data_amount: 'Unlimited', price: 24.99, network: '4G/5G', hotspot: true, speed: '150 Mbps', description: 'Unlimited data for a full month in Vietnam.' },
    ];
    for (const plan of vnPlans) {
      const existing = await prisma.plan.findFirst({ where: { country_id: vietnam.id, title: plan.title } });
      if (!existing) {
        await prisma.plan.create({ data: { ...plan, country_id: vietnam.id, price: plan.price } });
      }
    }
  }

  // Plans for Japan
  const japan = await prisma.country.findUnique({ where: { slug: 'japan' } });
  if (japan) {
    const jpPlans = [
      { title: 'Japan 5 Days', days: 5, data_amount: '5GB', price: 9.99, network: '4G/LTE', hotspot: true, speed: '150 Mbps', description: 'Fast 4G data for 5 days in Japan.' },
      { title: 'Japan 10 Days', days: 10, data_amount: '15GB', price: 16.99, network: '4G/LTE', hotspot: true, speed: '150 Mbps', description: '15GB data for 10 days in Japan.' },
      { title: 'Japan 30 Days', days: 30, data_amount: 'Unlimited', price: 34.99, network: '4G/5G', hotspot: true, speed: '200 Mbps', description: 'Unlimited data for a full month in Japan.' },
    ];
    for (const plan of jpPlans) {
      const existing = await prisma.plan.findFirst({ where: { country_id: japan.id, title: plan.title } });
      if (!existing) {
        await prisma.plan.create({ data: { ...plan, country_id: japan.id, price: plan.price } });
      }
    }
  }

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
