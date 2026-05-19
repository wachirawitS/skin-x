import Navbar from '@/shared/components/Navbar';
import PostList from '@/features/posts/components/PostList';

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">All Posts</h1>
        <PostList />
      </main>
    </div>
  );
}
