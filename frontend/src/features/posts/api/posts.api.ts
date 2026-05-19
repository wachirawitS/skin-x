import apiClient from '@/shared/lib/api-client';
import { Post, PostsResponse, Tag } from '../types/post.types';

export const postsApi = {
  getAll: (params: { tag?: string; page?: number; limit?: number }) =>
    apiClient.get<PostsResponse>('/posts', { params }).then((r) => r.data),

  getOne: (id: string) =>
    apiClient.get<Post>(`/posts/${id}`).then((r) => r.data),

  getTags: () =>
    apiClient.get<Tag[]>('/posts/tags').then((r) => r.data),
};
