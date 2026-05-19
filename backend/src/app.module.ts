import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { PostsModule } from './features/posts/posts.module';
import { UsersModule } from './features/users/users.module';
import { SeedModule } from './features/seed/seed.module';
import { User } from './features/users/entities/user.entity';
import { Post } from './features/posts/entities/post.entity';
import { Tag } from './features/posts/entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        database: config.get('DATABASE_NAME', 'skinx_db'),
        username: config.get('DATABASE_USER', 'skinx_user'),
        password: config.get('DATABASE_PASSWORD', 'skinx_password'),
        entities: [User, Post, Tag],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    SeedModule,
  ],
})
export class AppModule {}
