import Link from 'next/link';
import { Wifi, Facebook, Mail, Shield, Clock, Headphones } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="border-b border-gray-800">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'Secure Payment', sub: 'PayPal protected' },
              { icon: Clock, label: 'Manual Delivery', sub: 'Within 24 hours' },
              { icon: Headphones, label: '24/7 Support', sub: 'Always here for you' },
              { icon: Wifi, label: '4G/5G Networks', sub: 'Vietnam coverage' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                eSIM<span className="text-primary-400">Viet</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for Vietnam connectivity. Buy Vietnam eSIM online with fast digital delivery.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@esimviet.com"
                className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Vietnam Plans</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/countries/vietnam" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Vietnam Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'Guides', href: '/blog' },
                { name: 'Contact', href: '/contact' },
              ].map(({ name, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { name: 'How it Works', href: '/#how-it-works' },
                { name: 'Device Compatibility', href: '/#device-compatibility' },
                { name: 'How to Use', href: '/#how-to-use' },
                { name: 'FAQ', href: '/#faq' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Refund Policy', href: '/refund' },
              ].map(({ name, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} eSIM Viet. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              SSL Secured
            </span>
            <span>|</span>
            <span>PayPal Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
