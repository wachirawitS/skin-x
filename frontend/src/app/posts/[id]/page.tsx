import Navbar from '@/shared/components/Navbar';
import PostDetail from '@/features/posts/components/PostDetail';

interface Props {
  params: { id: string };
}

export default function PostDetailPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <PostDetail id={params.id} />
      </main>
    </div>
  );
}
