import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/entities/post.entity';
import { Tag } from '../posts/entities/tag.entity';
import { User } from '../users/entities/user.entity';

interface PostJson {
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  tags: string[];
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  onApplicationBootstrap() {
    // Run in background so server starts immediately
    setImmediate(() => {
      this.run().catch((err) => this.logger.error('Seed failed', err));
    });
  }

  private async run() {
    await this.seedUser();
    await this.seedPosts();
  }

  private async seedUser() {
    const exists = await this.userRepository.count({ where: { username: 'admin' } });
    if (exists > 0) return;

    const hashed = await bcrypt.hash('admin123', 10);
    await this.userRepository.save({ username: 'admin', password: hashed });
    this.logger.log('Default user created: admin / admin123');
  }

  private async seedPosts() {
    const count = await this.postRepository.count();
    if (count > 0) {
      this.logger.log('Posts already seeded, skipping');
      return;
    }

    const filePath = path.resolve(process.cwd(), 'posts.json');
    if (!fs.existsSync(filePath)) {
      this.logger.warn('posts.json not found, skipping seed');
      return;
    }

    this.logger.log('Seeding posts...');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const postsData: PostJson[] = JSON.parse(raw);

    // Pre-create all unique tags in one pass
    const uniqueTagNames = [...new Set(postsData.flatMap((p) => p.tags))];
    const tagMap = new Map<string, Tag>();

    for (const name of uniqueTagNames) {
      let tag = await this.tagRepository.findOne({ where: { name } });
      if (!tag) tag = await this.tagRepository.save(this.tagRepository.create({ name }));
      tagMap.set(name, tag);
    }

    // Batch insert posts in chunks of 50
    const CHUNK = 50;
    for (let i = 0; i < postsData.length; i += CHUNK) {
      const chunk = postsData.slice(i, i + CHUNK);
      const posts = chunk.map((item) =>
        this.postRepository.create({
          title: item.title,
          content: item.content,
          postedBy: item.postedBy,
          postedAt: new Date(item.postedAt),
          tags: item.tags.map((name) => tagMap.get(name)),
        }),
      );
      await this.postRepository.save(posts);
    }

    this.logger.log(`Seeded ${postsData.length} posts`);
  }
}
