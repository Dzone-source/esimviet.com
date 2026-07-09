'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ShieldCheck, AlertCircle, CheckCircle2, Phone } from 'lucide-react';

const COMPATIBLE_DEVICES = [
  {
    brand: 'Apple iPhone',
    models: 'iPhone XS, XR and newer (iPhone 11–16 series, SE 2nd gen+)',
  },
  {
    brand: 'Samsung Galaxy',
    models: 'Galaxy S20+, S21–S25, Z Flip/Fold series, Note 20+',
  },
  {
    brand: 'Google Pixel',
    models: 'Pixel 3 and newer',
  },
  {
    brand: 'Other Android',
    models: 'Many flagship models from Huawei, Oppo, Xiaomi, Sony — check Settings → SIM / Mobile Network for “Add eSIM”',
  },
];

const CHECKS = [
  {
    icon: Smartphone,
    title: '1. Your device supports eSIM',
    steps: [
      'Open your phone dialer and enter *#06#',
      'If you see an EID number (32 characters), your phone supports eSIM',
      'No EID shown? Your device does not support eSIM — a physical SIM is required instead',
      'iPhone alternative: Settings → General → About → look for “EID”',
    ],
  },
  {
    icon: ShieldCheck,
    title: '2. Your phone is not carrier-locked',
    steps: [
      'Contact your mobile carrier and ask if your device is unlocked for all networks',
      'Carrier-locked phones cannot install third-party eSIMs',
      'If locked, request an unlock from your carrier before purchasing',
    ],
  },
];

export default function DeviceCompatibilitySection() {
  const [eidChecked, setEidChecked] = useState<boolean | null>(null);

  return (
    <section id="device-compatibility" className="section bg-surface-50 scroll-mt-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-surface-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full mb-4 shadow-sm">
            <Phone className="w-4 h-4 text-primary-600" />
            Device Compatibility
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Check Your Device Compatible
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Before purchasing a Vietnam eSIM, confirm your phone meets both requirements below.
            You must satisfy all conditions to use eSIM normally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {CHECKS.map((check, i) => (
            <motion.div
              key={check.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                  <check.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{check.title}</h3>
              </div>
              <ol className="space-y-3">
                {check.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>

        {/* Quick EID self-check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-surface-200 mb-8"
        >
          <h3 className="font-bold text-gray-900 text-lg mb-2">Quick check: Does your phone show EID?</h3>
          <p className="text-gray-500 text-sm mb-5">
            Dial <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-primary-700">*#06#</code> on your phone now.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setEidChecked(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                eidChecked === true
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Yes, I see EID
            </button>
            <button
              type="button"
              onClick={() => setEidChecked(false)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                eidChecked === false
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              No EID shown
            </button>
          </div>
          {eidChecked === true && (
            <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              Great — your device likely supports eSIM. Also confirm your phone is not carrier-locked, then you are ready to purchase.
            </p>
          )}
          {eidChecked === false && (
            <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              Your device may not support eSIM. Please do not purchase unless you can confirm eSIM support with your phone manufacturer.
            </p>
          )}
        </motion.div>

        {/* Compatible devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-surface-200"
        >
          <h3 className="font-bold text-gray-900 text-lg mb-4">Commonly compatible devices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMPATIBLE_DEVICES.map((device) => (
              <div key={device.brand} className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                <p className="font-semibold text-gray-900 text-sm mb-1">{device.brand}</p>
                <p className="text-gray-500 text-sm">{device.models}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Device compatibility varies by region and carrier. When in doubt, contact us before purchasing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
