import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateSlug } from 'src/common/utils/index';
import { UserEntity } from 'src/user/user.entity';
import { ImageType } from 'src/common/types/common.type';
import { HTTP404, HTTPForbidden } from 'src/common/http.exceptions';
import { PostCreateDto, PostUpdateDto } from '../dto/post.body.dto';
import {
  PostListSerializer,
  PostDetailsSerializer,
} from '../dto/post.serializer.dto';
import { PostListQuery } from '../dto/post.urlParser.dto';
import { PostEntity, TagEntity, CommentEntity } from '../post.entity';
import { getPublishedPost } from '../post.query-manager';

import { convert } from 'html-to-text';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async createPost(
    userId: number,
    postData: PostCreateDto,
    image: ImageType,
  ): Promise<PostEntity> {
    const { title, content, tags, is_published, published_at } = postData;
    const post = new PostEntity();

    // Assign start
    post.slug = await generateSlug(this.postRepository, title, 'slug');
    post.title = title;
    post.content = content;
    post.short_content = convert(content, { wordwrap: 150 });

    if (image?.path) {
      post.image = image.path;
    }
    // const tags = ['One', 'Two', 'three'];
    if (tags) {
      const finalTags = await TagEntity.createOrGetTags(tags);
      post.tags = finalTags;
    }
    is_published != null && (post.is_published = is_published);
    published_at != null && (post.published_at = published_at);
    post.user = await UserEntity.getUser({ id: userId });
    // Assign end

    await this.postRepository.save(post);
    return post;
  }
  async getPosts(query: PostListQuery): Promise<PostListSerializer[]> {
    const queryBuilder = getPublishedPost();

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

    queryBuilder.offset(query.offset);
    queryBuilder.limit(query.limit);

    queryBuilder.innerJoinAndSelect('PostEntity.user', 'user');

    queryBuilder
      .loadRelationCountAndMap(
        'PostEntity.numberOfComment',
        'PostEntity.comments',
      )
      .loadRelationCountAndMap('PostEntity.numberOfVote', 'PostEntity.votes');

    const posts = await queryBuilder.getMany();

    return posts.map((post: PostEntity) => new PostListSerializer(post));
  }
  async getPost(slug: string): Promise<PostDetailsSerializer> {
    const queryBuilder = getPublishedPost();
    const post = await queryBuilder
      .andWhere('PostEntity.slug = :slug', { slug })
      .innerJoinAndSelect('PostEntity.user', 'user')
      .leftJoinAndSelect('PostEntity.tags', 'tag')
      .getOne();

    if (!post) HTTP404();

    const comments = await CommentEntity.getRepository()
      .createQueryBuilder()
      .andWhere('CommentEntity.post = :postId', { postId: post.id })
      .innerJoinAndSelect('CommentEntity.user', 'UserEntity')
      .getMany();

    post.comments = comments;

    return new PostDetailsSerializer(post);
  }

  async updatePost(
    userId: number,
    slug: string,
    postData: PostUpdateDto,
    image: ImageType,
  ): Promise<PostDetailsSerializer> {
    const post = await this.postRepository.findOne(
      { slug },
      { relations: ['user'] },
    );

    if (!post) HTTP404();
    else if (post.user.id !== userId) HTTPForbidden();
    else {
      const { title, content, is_published, published_at } = postData;

      if (image && image?.path) {
        post.image = image.path;
      }
      if (title !== undefined) title !== post.title && (post.title = title);
      if (content !== undefined)
        content !== post.content && (post.content = content);
      is_published !== undefined && (post.is_published = is_published);
      published_at !== undefined && (post.published_at = published_at);
      await this.postRepository.save(post);
      const updatePost = await this.postRepository.findOne(
        { slug },
        { relations: ['user', 'tags'] },
      );
      return new PostDetailsSerializer(updatePost);
    }
  }
  async deletePost(userId: number, slug: string) {
    const post = await this.postRepository.findOne(
      { slug },
      { relations: ['user'] },
    );
    if (!post) HTTP404();
    else if (post.user.id !== userId) HTTPForbidden();
    else {
      await this.postRepository.remove(post);
      return {
        message: 'Deleted successfully',
      };
    }
  }
}
