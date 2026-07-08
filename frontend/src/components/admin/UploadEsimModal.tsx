'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Upload, X, QrCode } from 'lucide-react';
import api from '@/lib/api';

interface Props {
  orderItemId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadEsimModal({ orderItemId, onClose, onSuccess }: Props) {
  const [activationCode, setActivationCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      toast.error('Activation code is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('activation_code', activationCode);
      if (manualCode) formData.append('manual_code', manualCode);
      if (qrFile) formData.append('qr_image', qrFile);

      await api.post(`/esim/upload/${orderItemId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-5 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">Upload eSIM</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* QR Image Upload */}
          <div>
            <label className="label">QR Code Image</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-surface-200 rounded-xl p-4 cursor-pointer hover:border-primary-400 transition-colors">
              {preview ? (
                <img src={preview} alt="QR Preview" className="w-32 h-32 object-contain rounded-lg" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-300 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload QR image</span>
                  <span className="text-xs text-gray-300 mt-1">PNG, JPG up to 5MB</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Activation Code */}
          <div>
            <label className="label">
              Activation Code <span className="text-red-500">*</span>
            </label>
            <textarea
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="LPA:1$..."
              rows={3}
              className="input font-mono text-xs resize-none"
              required
            />
          </div>

          {/* Manual Code */}
          <div>
            <label className="label">Manual Code (optional)</label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="SM-DP+ Address"
              className="input font-mono text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Send
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
