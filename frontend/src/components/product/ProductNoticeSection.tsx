'use client';

import { motion } from 'framer-motion';
import {
  Info,
  ShieldCheck,
  Smartphone,
  Wifi,
  PhoneOff,
  MessageCircle,
} from 'lucide-react';

const VOIP_APPS = [
  'WhatsApp',
  'Telegram',
  'Messenger',
  'FaceTime',
  'LINE',
  'Zalo',
  'Skype',
];

export default function ProductNoticeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mb-10"
    >
      <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-sky-50 overflow-hidden shadow-sm">
        <div className="flex items-start gap-3 px-5 py-4 md:px-6 md:py-5 border-b border-primary-100 bg-primary-600/5">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Important Product Information
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Everything international travelers should know before purchasing this Vietnam eSIM.
            </p>
          </div>
        </div>

        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <NoticeItem
            icon={ShieldCheck}
            title="No passport or ID required"
            description="Activation is simple and does not require passport verification or any registration."
            tone="emerald"
          />
          <NoticeItem
            icon={Smartphone}
            title="Data-only eSIM"
            description="This plan provides mobile internet access only. It does not include a local phone number."
            tone="primary"
          />
          <NoticeItem
            icon={PhoneOff}
            title="No voice calls or SMS"
            description="Traditional phone calls and text messages (SMS) are not supported on this eSIM."
            tone="amber"
          />
          <NoticeItem
            icon={Wifi}
            title="Internet-based calls supported"
            description="You can still make voice and video calls using apps over mobile data or Wi-Fi."
            tone="sky"
          />
        </div>

        <div className="px-5 pb-5 md:px-6 md:pb-6">
          <div className="rounded-xl border border-surface-200 bg-white p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <MessageCircle className="w-4 h-4 text-primary-600" />
              Use these apps for calls and messaging
            </div>
            <div className="flex flex-wrap gap-2">
              {VOIP_APPS.map((app) => (
                <span
                  key={app}
                  className="inline-flex items-center rounded-full bg-surface-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {app}
                </span>
              ))}
              <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700">
                + other VoIP apps
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NoticeItem({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tone: 'primary' | 'emerald' | 'amber' | 'sky';
}) {
  const toneClasses = {
    primary: 'bg-primary-50 text-primary-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-surface-200 bg-white p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm md:text-base">{title}</p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
