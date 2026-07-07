'use client';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FacebookMessenger() {
  const [isOpen, setIsOpen] = useState(false);
  const pageId = process.env.NEXT_PUBLIC_FB_MESSENGER;

  if (!pageId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-card-hover border border-surface-200 p-4 w-56"
          >
            <p className="text-sm font-semibold text-gray-800 mb-1">Chat with us</p>
            <p className="text-xs text-gray-500 mb-3">We typically reply within minutes</p>
            <a
              href={`https://m.me/${pageId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-sm py-2"
            >
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#0084ff] hover:bg-[#0073e6] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Open Messenger"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
