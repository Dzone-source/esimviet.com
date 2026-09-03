'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Wifi, Settings, Signal } from 'lucide-react';

const SECTIONS = [
  {
    id: 'before-install',
    title: 'Before installation',
    icon: Wifi,
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Please make sure:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your device supports eSIM and is not carrier-locked (see Device Compatibility above).</li>
          <li>Your phone is connected to a stable Wi-Fi or mobile network — internet is required to install.</li>
          <li>You have received your QR code and activation details by email (within 24 hours after payment).</li>
        </ul>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
          <strong>Vietnam tip:</strong> We recommend installing the eSIM after you arrive in Vietnam (connect to airport or hotel Wi-Fi).
          Installing too early while transiting may activate the plan before you reach Vietnam.
        </div>
        <p>
          After the first installation, the eSIM is bound to your current device and cannot be transferred to another phone.
          Please confirm your device before installing.
        </p>
      </div>
    ),
  },
  {
    id: 'install',
    title: 'Install eSIM (Scan QR code / Manual)',
    icon: Settings,
    content: (
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-800">Method: Scan QR code</p>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">1</span>
            <span>Open the QR code in your order confirmation email. Print it or display it on another device.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">2</span>
            <span>
              <strong>iOS:</strong> Settings → Cellular / Mobile Data → Add eSIM → Use QR Code
              <br />
              <strong>Android:</strong> Settings → SIM Manager / Mobile Network → Add eSIM → Scan QR code
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">3</span>
            <span>Scan the QR code while connected to the internet and follow the on-screen prompts.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">4</span>
            <span>
              If scanning fails, enter the <strong>SM-DP+ Address</strong> and <strong>Activation Code</strong> manually (included in your email).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">5</span>
            <span>
              Still failing? Your device may be carrier-locked. Contact your carrier to unlock before installing.
            </span>
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 'enable',
    title: 'Enable eSIM in Vietnam',
    icon: Signal,
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Complete these steps <strong>after arriving in Vietnam</strong> to avoid early activation:</p>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">1</span>
            <span>Turn off mobile data on your primary SIM, or disable the primary SIM temporarily.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">2</span>
            <span>
              Enable the Vietnam eSIM:
              <br />
              <strong>iOS:</strong> Settings → Cellular → select the eSIM → turn on “Turn On This Line” and set as mobile data
              <br />
              <strong>Android:</strong> Settings → SIM Manager → enable the eSIM → set Mobile Data to this eSIM
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">3</span>
            <span>Turn on <strong>Data Roaming</strong> for the eSIM line.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">4</span>
            <span>If you still cannot connect, configure the APN (see below) and restart your phone.</span>
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 'apn',
    title: 'APN settings (if needed)',
    icon: Settings,
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Most Vietnam eSIMs configure APN automatically. If you have no internet after enabling the eSIM:</p>
        <ol className="space-y-2 list-decimal pl-5">
          <li>
            <strong>iOS:</strong> Settings → Cellular → Cellular Data Network → enter APN from your email
          </li>
          <li>
            <strong>Android:</strong> Settings → Mobile Network → Access Point Names (APN) → add or edit APN from your email
          </li>
          <li>Restart your phone after saving APN settings.</li>
        </ol>
        <p className="text-gray-500">APN details are included in your order confirmation email alongside the QR code.</p>
      </div>
    ),
  },
  {
    id: 'troubleshoot',
    title: 'Troubleshooting',
    icon: Wifi,
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>If your eSIM is not working, try these steps in order:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Select the eSIM as your mobile data source.</li>
          <li>Enable Data Roaming for the eSIM line.</li>
          <li>Check and update APN settings manually.</li>
          <li>Restart your phone.</li>
          <li>Disable any VPN apps temporarily.</li>
          <li>Confirm hotspot is enabled in plan settings if sharing data.</li>
        </ul>
        <p>
          Still having issues? Contact us at{' '}
          <a href="mailto:support@esimviet.com" className="text-primary-600 hover:underline font-medium">
            support@esimviet.com
          </a>{' '}
          with your order number and a screenshot of your SIM settings.
        </p>
      </div>
    ),
  },
];

export default function HowToUseSection() {
  const [openId, setOpenId] = useState<string>('before-install');

  return (
    <section id="how-to-use" className="section bg-white scroll-mt-20">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            Setup Guide
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            How to Use
          </h2>
          <p className="text-gray-500">
            Step-by-step instructions to install and activate your Vietnam eSIM.
          </p>
        </motion.div>

        <div className="space-y-3">
          {SECTIONS.map((section, i) => {
            const isOpen = openId === section.id;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-surface-200 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : section.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-50 transition-colors"
                >
                  <span className="flex items-center gap-3 font-semibold text-gray-900 pr-4">
                    <section.icon className="w-5 h-5 text-primary-600 shrink-0" />
                    {section.title}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-surface-100 pt-4">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
