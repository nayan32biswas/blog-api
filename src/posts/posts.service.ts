import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateSlug } from '../common/utils/index';
import { UserEntity } from '../users/users.entity';
import { PostCreateDto, PostUpdateDto } from './dto/posts.body.dto';
import {
  PostListSerializer,
  PostDetailsSerializer,
} from './dto/posts.serializer.dto';
import { PostListQuery } from './dto/posts.query.dto';
import { PostEntity, TagEntity } from './posts.entity';
import { ImageType } from '../common/types/common.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  async create(
    userId: number,
    postData: PostCreateDto,
    image: ImageType,
  ): Promise<PostEntity> {
    const { title, content, tags, isPublished, publishedAt } = postData;
    const post = new PostEntity();

    // Assign start
    post.slug = await generateSlug(this.postsRepository, title, 'slug');
    post.title = title;
    post.content = content;
    if (image?.path) {
      post.image = image.path;
    }
    // const tags = ['One', 'Two', 'three'];
    if (tags) {
      const finalTags = await TagEntity.createOrGetTags(tags);
      post.tags = finalTags;
    }
    isPublished !== undefined && (post.isPublished = isPublished);
    publishedAt !== undefined && (post.publishedAt = publishedAt);
    post.user = await UserEntity.getUser({ id: userId });
    // Assign end

    await this.postsRepository.save(post);
    return post;
  }
  async getPosts(query: PostListQuery): Promise<PostListSerializer[]> {
    const queryBuilder = PostEntity.getPublished();

    if (query.tag) {
      queryBuilder.innerJoin(
        'PostEntity.tags',
        'TagEntity',
        'TagEntity.name = :tag',
        { tag: query.tag },
      );
    }
    if (query.username) {
      queryBuilder
        .leftJoinAndSelect('PostEntity.user', 'UserEntity')
        .andWhere('UserEntity.username LIKE :username', {
          username: `%${query.username}%`,
        });
    }
    if (query.q) {
      queryBuilder.andWhere(
        '(PostEntity.slug = :slug OR PostEntity.title LIKE :title)',
        {
          slug: query.q,
          title: `%${query.q}%`,
        },
      );
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    if (query.limit) {
      const limit = Math.min(query.limit, 50);
      queryBuilder.limit(limit);
    }
    queryBuilder.innerJoinAndSelect('PostEntity.user', 'user');
    const posts = await queryBuilder.getMany();

    return posts.map((post: PostEntity) => new PostListSerializer(post));
  }
  async getPost(slug: string): Promise<PostDetailsSerializer> {
    const queryBuilder = PostEntity.getPublished();
    const post = await queryBuilder
      .andWhere('PostEntity.slug = :slug', { slug })
      .innerJoinAndSelect('PostEntity.user', 'user')
      .leftJoinAndSelect('PostEntity.tags', 'tag')
      .getOne();

    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return new PostDetailsSerializer(post);
  }

  async update(
    userId: number,
    slug: string,
    postData: PostUpdateDto,
    image: ImageType,
  ): Promise<PostDetailsSerializer> {
    const post = await this.postsRepository.findOne(
      { slug },
      { relations: ['user'] },
    );

    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (post.user.id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      const { title, content, isPublished, publishedAt } = postData;

      if (image && image?.path) {
        post.image = image.path;
      }
      if (title !== undefined) title !== post.title && (post.title = title);
      if (content !== undefined)
        content !== post.content && (post.content = content);
      isPublished !== undefined && (post.isPublished = isPublished);
      publishedAt !== undefined && (post.publishedAt = publishedAt);
      await this.postsRepository.save(post);
      const updatePost = await this.postsRepository.findOne(
        { slug },
        { relations: ['user', 'tags'] },
      );
      return new PostDetailsSerializer(updatePost);
    }
  }
  async delete(userId: number, slug: string) {
    const post = await this.postsRepository.findOne(
      { slug },
      { relations: ['user'] },
    );
    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (post.user.id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      await this.postsRepository.remove(post);
      return {
        message: 'Deleted successfully',
      };
    }
  }
}
