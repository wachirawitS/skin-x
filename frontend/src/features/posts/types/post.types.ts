export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  tags: Tag[];
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostsResponse {
  data: Post[];
  meta: PaginationMeta;
}
