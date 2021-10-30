import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateSlug } from '../common/utils/index';
import { UserEntity } from '../users/users.entity';
import { PostCreateDto, PostUpdateDto } from './dto/posts.body.dto';
import { PostListSerializer } from './dto/posts.serializer.dto';
import { PostDetailsQuery } from './dto/posts.query.dto';
import { PostEntity } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(
    userId: number,
    postCreateDto: PostCreateDto,
    image: Express.Multer.File | undefined,
  ): Promise<PostEntity> {
    const post = new PostEntity();

    post.slug = await generateSlug(
      this.postsRepository,
      postCreateDto.title,
      'slug',
    );
    post.title = postCreateDto.title;
    post.content = postCreateDto.content;
    if (image?.path) {
      post.image = image['path'];
    }
    post.user = await this.usersRepository.findOne(userId);
    await this.postsRepository.save(post);
    return post;
  }
  async getPosts(query: PostDetailsQuery): Promise<PostListSerializer[]> {
    console.log(query);
    const posts = await this.postsRepository.find({ relations: ['user'] });
    return posts.map((post: PostEntity) => new PostListSerializer(post));
  }
  async getPost(slug: string): Promise<PostEntity> {
    const post = await this.postsRepository.findOne(
      { slug },
      { relations: ['user'] },
    );
    return post;
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
