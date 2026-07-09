'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'What is an eSIM?',
    answer: 'An eSIM (embedded SIM) is a digital SIM card built into your device. Instead of inserting a physical SIM card, you scan a QR code to install a data plan directly onto your phone. No need to swap physical cards!',
  },
  {
    question: 'Is my phone compatible with eSIM?',
    answer: 'Most modern smartphones support eSIM, including iPhone XS and newer, Samsung Galaxy S20+, Google Pixel 3 and newer, and many other Android phones. Check your device settings or manufacturer website to confirm eSIM support.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'After your payment is confirmed, our team will prepare your eSIM QR code manually. Delivery typically takes 1-24 hours. You will receive the QR code and instructions via email.',
  },
  {
    question: 'When should I activate my eSIM?',
    answer: 'We recommend installing the eSIM before you travel while connected to WiFi. The data plan starts when you arrive in Vietnam and connect to a local network.',
  },
  {
    question: 'Can I use hotspot / tethering?',
    answer: 'Yes! All our plans include hotspot/tethering support, so you can share your connection with your laptop, tablet, or other devices while traveling.',
  },
  {
    question: 'What if I have issues with my eSIM?',
    answer: 'Our 24/7 support team is always available to help. Contact us via email or Facebook Messenger and we will resolve any connectivity issues as quickly as possible.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer refunds for unused eSIMs before the QR code has been delivered. Once the eSIM has been activated, refunds are handled case by case. Please contact our support team.',
  },
  {
    question: 'Do you support multiple devices?',
    answer: 'Each eSIM code is tied to one device. If you need eSIMs for multiple people or devices, simply purchase multiple quantities during checkout.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section bg-white">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">Everything you need to know about our eSIM service.</p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-surface-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-surface-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
