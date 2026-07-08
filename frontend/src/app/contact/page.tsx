import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import { Mail, MessageCircle, Clock, HeadphonesIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us – eSIM Global Support',
  description: 'Need help with your eSIM? Contact our 24/7 support team via email or live chat.',
};

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="pt-20 pb-24 min-h-screen bg-surface-50">
        <div className="hero-gradient py-14">
          <div className="container text-center">
            <h1 className="text-4xl font-black text-white mb-3">Get in Touch</h1>
            <p className="text-white/80 text-lg">Our support team is ready to help 24/7</p>
          </div>
        </div>

        <div className="container mt-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mail, title: 'Email Support', desc: 'support@esimglobal.com', sub: 'Response within 2 hours' },
              { icon: MessageCircle, title: 'Live Chat', desc: 'Facebook Messenger', sub: 'Instant responses' },
              { icon: Clock, title: 'Support Hours', desc: '24/7 Available', sub: 'Including weekends' },
            ].map(({ icon: Icon, title, desc, sub }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-card border border-surface-200 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-primary-600 font-medium text-sm">{desc}</p>
                <p className="text-gray-400 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-card border border-surface-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name</label>
                  <input type="text" className="input" placeholder="John Smith" />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="label">Order Number (if applicable)</label>
                <input type="text" className="input font-mono" placeholder="ESM-XXXXXXXX" />
              </div>
              <div>
                <label className="label">Subject</label>
                <input type="text" className="input" placeholder="How can we help you?" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input resize-none" rows={5} placeholder="Describe your issue or question..." />
              </div>
              <button type="submit" className="btn-primary">
                <Mail className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
