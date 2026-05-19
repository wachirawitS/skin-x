'use client';

import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/posts.api';
import { Post, Tag, PaginationMeta } from '../types/post.types';
import PostCard from './PostCard';
import TagFilter from './TagFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

function PostCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTags = useCallback(async () => {
    const data = await postsApi.getTags();
    setTags(data);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsApi.getAll({ tag: selectedTag || undefined, page, limit: 10 });
      setPosts(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [selectedTag, page]);

  useEffect(() => { fetchTags(); }, [fetchTags]);
  useEffect(() => { setPage(1); }, [selectedTag]);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <div>
      <TagFilter tags={tags} selected={selectedTag} onChange={setSelectedTag} />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-1">Try selecting a different tag</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
