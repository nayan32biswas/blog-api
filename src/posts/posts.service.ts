import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateSlug } from '../common/utils/index';
import { UserEntity } from '../users/users.entity';
import { TagEntity } from '../tags/tags.entity';
import { PostCreateDto, PostUpdateDto } from './dto/posts.body.dto';
import {
  PostListSerializer,
  PostDetailsSerializer,
} from './dto/posts.serializer.dto';
import { PostDetailsQuery } from './dto/posts.query.dto';
import { PostEntity } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  async create(
    userId: number,
    body: PostCreateDto,
    image: Express.Multer.File | undefined,
  ): Promise<PostEntity> {
    const post = new PostEntity();

    post.slug = await generateSlug(this.postsRepository, body.title, 'slug');
    post.title = body.title;
    post.content = body.content;
    if (image?.path) {
      post.image = image.path;
    }
    // body.tags = ['One', 'Two', 'three'];
    if (body.tags) {
      const finalTags = await TagEntity.createOrGetTags(body.tags);
      post.tags = finalTags;
    }
    post.user = await UserEntity.getUser({ id: userId });
    await this.postsRepository.save(post);
    return post;
  }
  async getPosts(query: PostDetailsQuery): Promise<PostListSerializer[]> {
    let queryBuilder = this.postsRepository.createQueryBuilder();
    if (query.offset) {
      queryBuilder = queryBuilder.offset(query.offset);
    }
    if (query.tag) {
      queryBuilder = queryBuilder.innerJoin(
        'PostEntity.tags',
        'TagEntity',
        'TagEntity.name = :tag',
        { tag: query.tag },
      );
    }
    if (query.username) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('PostEntity.user', 'UserEntity')
        .where('UserEntity.username = :username', { username: query.username });
    }
    if (query.q) {
      queryBuilder = queryBuilder.where(
        'PostEntity.slug = :slug OR PostEntity.title LIKE :title',
        {
          slug: `%${query.q}%`,
          title: `%${query.q}%`,
        },
      );
    }
    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }
    queryBuilder.innerJoinAndSelect('PostEntity.user', 'user');
    const posts = await queryBuilder.getMany();
    return posts.map((post: PostEntity) => new PostListSerializer(post));
  }
  async getPost(slug: string): Promise<PostDetailsSerializer> {
    const post = await this.postsRepository.findOne(
      { slug },
      { relations: ['user', 'tags'] },
    );
    return new PostDetailsSerializer(post);
  }

  async update(
    userId: number,
    slug: string,
    data: PostUpdateDto,
  ): Promise<PostEntity> {
    const post = await this.postsRepository.findOne(
      { slug },
      { relations: ['user'] },
    );

    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (post.user.id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      data.title !== post.title && (post.title = data.title);
      data.content !== post.content && (post.content = data.content);
      return await this.postsRepository.save(post);
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
