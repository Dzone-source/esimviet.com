import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import type { BlogBlock, BlogPost } from '@/lib/blogPosts';

interface BlogArticleProps {
  post: BlogPost;
}

export default function BlogArticle({ post }: BlogArticleProps) {
  return (
    <article>
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container max-w-3xl mx-auto">
            <span className="inline-block badge bg-white/20 text-white border border-white/30 mb-3">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8 pb-6 border-b border-surface-100">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="text-gray-300">•</span>
            <span>{post.readTime} read</span>
          </div>

          <div className="prose-blog space-y-6">
            {post.content.map((block, index) => (
              <BlogBlockRenderer key={`${post.slug}-${index}`} block={block} />
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-surface-100">
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Ready for your Vietnam trip?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get affordable 4G/5G data with hotspot included. QR code delivered by email.
              </p>
              <Link href="/countries/vietnam" className="btn-primary inline-flex">
                View Vietnam eSIM Plans
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all guides
          </Link>
        </div>
      </div>
    </article>
  );
}

function BlogBlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-gray-600 leading-relaxed">{block.text}</p>;

    case 'heading':
      return <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-2">{block.text}</h2>;

    case 'list':
      return (
        <ul className="space-y-2 pl-5 list-disc marker:text-primary-400">
          {block.items.map((item) => (
            <li key={item} className="text-gray-600 leading-relaxed text-sm md:text-base">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'tip':
      return (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 md:p-5">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm mb-1">{block.title}</p>
            <p className="text-amber-800 text-sm leading-relaxed">{block.text}</p>
          </div>
        </div>
      );

    case 'image':
      return (
        <figure className="rounded-2xl overflow-hidden border border-surface-200">
          <div className="relative aspect-[16/10]">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-gray-500 px-4 py-3 bg-surface-50">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
