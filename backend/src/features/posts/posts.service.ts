import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { QueryPostsDto } from './dto/query-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(query: QueryPostsDto) {
    const { tag, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .orderBy('post.postedAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (tag) {
      qb.andWhere('tag.name = :tag', { tag });
    }

    const [posts, total] = await qb.getManyAndCount();

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  async findAllTags(): Promise<Tag[]> {
    return this.tagRepository.find({ order: { name: 'ASC' } });
  }
}
