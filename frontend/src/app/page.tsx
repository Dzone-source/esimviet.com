import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import PopularDestinations from '@/components/home/PopularDestinations';
import BenefitsSection from '@/components/home/BenefitsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'eSIM Global – Buy eSIM Online for Travel | Affordable Data Plans',
  description:
    'Buy eSIM online for 100+ countries. Affordable data plans, 4G/5G networks, manual delivery within 24 hours. Stay connected anywhere in the world.',
};

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <PopularDestinations />
      <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </MainLayout>
  );
}
