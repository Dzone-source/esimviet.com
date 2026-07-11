'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const PRODUCT_FAQS = [
  {
    question: 'Do I need a passport to activate this eSIM?',
    answer: 'No. This Vietnam eSIM does not require a passport or identity verification.',
  },
  {
    question: 'Does this eSIM include a phone number?',
    answer: 'No. This is a data-only eSIM and does not include a local phone number.',
  },
  {
    question: 'Can I make phone calls or send SMS?',
    answer: 'No. Voice calls and SMS are not supported. You can use internet-based communication apps instead.',
  },
  {
    question: 'How can I make calls?',
    answer: 'Use apps such as WhatsApp, Telegram, Messenger, FaceTime, LINE, Zalo, Skype, or other VoIP services.',
  },
  {
    question: 'Does this eSIM support hotspot/tethering?',
    answer: 'Yes, unless otherwise stated on the product page.',
  },
  {
    question: 'When should I install the eSIM?',
    answer: 'We recommend installing it before arriving in Vietnam and activating it when you are ready to start using mobile data.',
  },
  {
    question: 'Can I use my physical SIM together with this eSIM?',
    answer: 'Yes. If your device supports Dual SIM (physical SIM + eSIM), you can keep your regular SIM for calls and SMS while using this eSIM for internet access.',
  },
  {
    question: 'What devices are compatible?',
    answer: 'Any carrier-unlocked smartphone or tablet that supports eSIM technology.',
  },
];

export default function ProductFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="product-faq" className="section bg-white">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            Product FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Vietnam eSIM Questions
          </h2>
          <p className="text-gray-500">
            Clear answers for international travelers before you buy.
          </p>
        </motion.div>

        <div className="space-y-3">
          {PRODUCT_FAQS.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="border border-surface-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-50 transition-colors"
                aria-expanded={openIndex === i}
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

              <AnimatePresence initial={false}>
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
