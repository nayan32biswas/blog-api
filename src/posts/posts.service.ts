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
    postData: PostCreateDto,
    image: Express.Multer.File | undefined,
  ): Promise<PostEntity> {
    const { title, content, tags } = postData;
    const post = new PostEntity();

    post.slug = await generateSlug(this.postsRepository, title, 'slug');
    post.title = title;
    post.content = content;
    if (image?.path) {
      post.image = image.path;
    }
    // tags = ['One', 'Two', 'three'];
    if (tags) {
      const finalTags = await TagEntity.createOrGetTags(tags);
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
        .andWhere('UserEntity.username = :username', {
          username: query.username,
        });
    }
    if (query.q) {
      queryBuilder = queryBuilder.andWhere(
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
    postData: PostUpdateDto,
  ): Promise<PostEntity> {
    const { title, content } = postData;
    const post = await this.postsRepository.findOne(
      { slug },
      { relations: ['user'] },
    );

    if (!post) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (post.user.id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      title !== post.title && (post.title = title);
      content !== post.content && (post.content = content);
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
