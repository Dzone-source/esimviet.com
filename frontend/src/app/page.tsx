import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import VietnamPlansSection from '@/components/home/VietnamPlansSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import DeviceCompatibilitySection from '@/components/home/DeviceCompatibilitySection';
import HowToUseSection from '@/components/home/HowToUseSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'eSIM Viet – Buy Vietnam eSIM Online | Affordable Data Plans',
  description:
    'Buy Vietnam eSIM online. Affordable 4G/5G data plans, hotspot included, QR code delivered by email within 24 hours.',
};

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <VietnamPlansSection />
      <BenefitsSection />
      <HowItWorksSection />
      <DeviceCompatibilitySection />
      <HowToUseSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </MainLayout>
  );
}
