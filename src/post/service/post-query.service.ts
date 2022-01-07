import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HTTP404 } from 'src/common/http.exceptions';
import { PostEntity } from '../post.entity';

@Injectable()
export class PostQueryService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  getPublishedPost() {
    const queryBuilder = this.postRepository.createQueryBuilder();
    queryBuilder.andWhere(
      `((PostEntity.publishedAt IS NULL AND PostEntity.isPublished = true) OR (PostEntity.publishedAt IS NOT NULL AND PostEntity.publishedAt <= :publishedAt))`,
      { publishedAt: new Date() },
    );
    return queryBuilder;
  }

  async getPublishedPostObjOr404(slug: string) {
    const queryBuilder = this.getPublishedPost();
    queryBuilder.andWhere('PostEntity.slug = :slug', { slug });
    const post = await queryBuilder.getOne();
    if (!post) HTTP404();

    return post;
  }
}
