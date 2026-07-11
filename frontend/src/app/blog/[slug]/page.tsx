import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import BlogArticle from '@/components/blog/BlogArticle';
import { getAllBlogSlugs, getBlogPost } from '@/lib/blogPosts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Article Not Found – eSIM Viet' };
  }

  return {
    title: `${post.title} – eSIM Viet`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="pt-16 pb-16 min-h-screen bg-surface-50">
        <BlogArticle post={post} />
      </div>
    </MainLayout>
  );
}
