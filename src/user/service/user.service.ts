import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImageType, KeyObject } from 'src/common/types/common.type';
import { UserEntity } from '../user.entity';
import { UserUpdateDto } from '../dto/user.dto';
import { UserSerializer } from '../dto/user.serializer';
import { PostListQuery } from 'src/post/dto/post.urlParser.dto';
import { PostListSerializer } from 'src/post/dto/post.serializer.dto';
import { PostEntity } from 'src/post/post.entity';
import { AuthService } from '../../auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}
  async registration(userData: KeyObject): Promise<UserEntity> {
    const { password, email, first_name, last_name, role } = userData;

    const previousUser = await this.userRepository.findOne({ email: email });
    if (previousUser) {
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPass = await this.authService.getHashPass(password);

    const user = new UserEntity();
    user.password = hashPass;
    user.email = email;
    user.username = email.match(/^([^@]*)@/)[1];
    user.first_name = first_name;
    user.last_name = last_name;
    user.role = role;

    await this.userRepository.save(user);
    return user;
  }
  async login(user: any) {
    // const payload = { username: user.username, id: user.id };
    return {
      access_token: this.authService.createAccessToken(user),
      refresh_token: 'Implement It',
    };
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne(id);
    return new UserSerializer(user);
  }

  async update(
    id: string,
    userData: UserUpdateDto,
    picture: ImageType,
  ): Promise<UserEntity> {
    const { first_name, last_name, birth_date } = userData;

    const user = await this.userRepository.findOne(id);

    first_name !== user.first_name && (user.first_name = first_name);
    last_name !== user.last_name && (user.last_name = last_name);
    birth_date !== user.birth_date && (user.birth_date = birth_date);
    picture !== undefined && (user.picture = picture.path);

    return await this.userRepository.save(user);
  }
  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne(id);
    this.userRepository.remove(user);
  }

  async getUserPosts(
    userId: number,
    query: PostListQuery,
  ): Promise<PostListSerializer[]> {
    let queryBuilder = PostEntity.getRepository().createQueryBuilder();
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
    queryBuilder = queryBuilder
      .leftJoinAndSelect('PostEntity.user', 'UserEntity')
      .andWhere('UserEntity.id = :id', {
        id: userId,
      });

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
      const limit = Math.min(query.limit, 50);
      queryBuilder = queryBuilder.limit(limit);
    }
    queryBuilder.innerJoinAndSelect('PostEntity.user', 'user');
    const posts = await queryBuilder.getMany();
    return posts.map((post: PostEntity) => new PostListSerializer(post));
  }
}
