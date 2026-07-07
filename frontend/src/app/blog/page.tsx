import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Guides & Blog – eSIM Global',
  description: 'Travel tips, eSIM guides, and destination insights for globetrotters.',
};

const POSTS = [
  {
    slug: 'how-to-install-esim',
    title: 'How to Install an eSIM: Complete Step-by-Step Guide',
    excerpt: 'Learn how to install and activate your eSIM on iPhone and Android devices in just a few minutes.',
    category: 'Guide',
    date: '2024-01-15',
    readTime: '5 min',
    emoji: '📱',
  },
  {
    slug: 'best-esim-for-japan',
    title: 'Best eSIM for Japan Travel 2024: Everything You Need to Know',
    excerpt: "Japan has excellent 4G/5G coverage. Here's how to choose the right eSIM plan for your Japanese adventure.",
    category: 'Destination',
    date: '2024-01-10',
    readTime: '7 min',
    emoji: '🗾',
  },
  {
    slug: 'esim-vs-sim-card',
    title: 'eSIM vs Physical SIM Card: Which is Better for Travel?',
    excerpt: 'Compare eSIM and physical SIM cards to decide which is the best option for international travel.',
    category: 'Guide',
    date: '2024-01-05',
    readTime: '6 min',
    emoji: '🔄',
  },
  {
    slug: 'vietnam-travel-tips',
    title: 'Vietnam Travel Guide: Best Tips for First-Time Visitors',
    excerpt: "Everything you need to know before visiting Vietnam – from connectivity to culture and cuisine.",
    category: 'Destination',
    date: '2023-12-28',
    readTime: '10 min',
    emoji: '🇻🇳',
  },
];

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="pt-20 pb-24 min-h-screen bg-surface-50">
        <div className="hero-gradient py-14">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 px-4 py-2 rounded-full text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              Travel Guides
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Travel Guides & Tips</h1>
            <p className="text-white/80">Everything you need to know about eSIMs and travel connectivity</p>
          </div>
        </div>

        <div className="container mt-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {POSTS.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl overflow-hidden shadow-card border border-surface-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 h-32 flex items-center justify-center">
                  <span className="text-6xl">{post.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge bg-primary-50 text-primary-700">{post.category}</span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{post.readTime} read</span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{post.title}</h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <Link href={`/blog/${post.slug}`} className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
