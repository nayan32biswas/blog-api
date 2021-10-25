import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KeyObject } from '../common/types/common.type';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCreateDto } from './types/posts.dto';
import { User } from '../users/users.entity';
import { generateSlug } from '../common/utils/index';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: number, postCreateDto: PostCreateDto): Promise<Post> {
    const post = new Post();

    post.slug = await generateSlug(
      this.postsRepository,
      postCreateDto.title,
      'slug',
    );
    post.title = postCreateDto.title;
    post.content = postCreateDto.content;
    post.user = await this.usersRepository.findOne(userId);

    await this.postsRepository.save(post);
    return post;
  }
  async getPosts(): Promise<Post[]> {
    return await this.postsRepository.find();
  }
  async getPost(slug: string): Promise<Post> {
    console.log(slug);
    // const relations = ['user'];
    return await this.postsRepository.findOne({
      slug,
      // relations,
    });
  }

  update(userId: number, slug: string, data: KeyObject): KeyObject {
    return data;
  }
  async delete(userId: number, slug: string) {
    const post = await this.postsRepository.findOne({ slug });
    console.log(post.user, userId);
    // if (post.user.id !== userId) {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }
    // await this.postsRepository.remove(post);
  }
}
