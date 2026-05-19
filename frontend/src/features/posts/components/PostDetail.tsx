'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import { postsApi } from '../api/posts.api';
import { Post } from '../types/post.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function PostDetailSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Skeleton className="h-4 w-16" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-[1px] w-full" />
      <div className="space-y-3 pt-2">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

interface Props {
  id: string;
}

export default function PostDetail({ id }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [safeHtml, setSafeHtml] = useState('');
  const router = useRouter();

  useEffect(() => {
    postsApi.getOne(id)
      .then(async (data) => {
        setPost(data);
        const DOMPurify = (await import('dompurify')).default;
        setSafeHtml(DOMPurify.sanitize(data.content));
      })
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PostDetailSkeleton />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
      <p className="text-lg">{error}</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/posts">← Back to posts</Link>
      </Button>
    </div>
  );

  if (!post) return null;

  const date = new Date(post.postedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.postedBy}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {date}
          </span>
        </div>
      </div>

      <Separator />

      <div
        className="post-content text-foreground/90"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  );
}
