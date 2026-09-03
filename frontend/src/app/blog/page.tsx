import type { Metadata } from 'next';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blogPosts';

export const metadata: Metadata = {
  title: 'Vietnam eSIM Guides – eSIM Viet',
  description: 'Vietnam travel tips, eSIM setup guides, and connectivity advice for international visitors.',
};

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="pt-20 pb-24 min-h-screen bg-surface-50">
        <div className="relative hero-gradient py-14 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/blog/ha-giang-road.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-800/90" />
          <div className="container text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 px-4 py-2 rounded-full text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              Vietnam Guides
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Vietnam Travel & eSIM Guides</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Practical tips for staying connected, saving money, and making the most of your Vietnam trip.
            </p>
          </div>
        </div>

        <div className="container mt-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-card border border-surface-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <Link href={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden group">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge bg-primary-50 text-primary-700">{post.category}</span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{post.readTime} read</span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <time className="text-gray-400 text-xs" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1"
                    >
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
