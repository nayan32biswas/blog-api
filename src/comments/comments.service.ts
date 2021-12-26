import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './comments.entity';
import { CommentCreateDto, CommentUpdateDto } from './dto/comments.body.dto';
import { CommentSerializer } from './dto/comments.serializer.dto';
import { getPublishedPostObjOr404 } from '../posts/query.manager';
import { UserEntity } from 'src/users/users.entity';
import { HTTP404, HTTPForbidden } from '../common/exceptions';
import { CommentListQuery } from './dto/comments.urlParser.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    userId: number,
    postSlug: string,
    commentData: CommentCreateDto,
  ): Promise<CommentSerializer> {
    console.log(userId, postSlug, commentData);

    const post = await getPublishedPostObjOr404(postSlug);

    const comment = new CommentEntity();

    if (commentData.parentId) {
      const parentComment = await this.commentsRepository.findOne({
        id: commentData.parentId,
        post: post,
      });
      if (!parentComment) HTTP404();
      if (parentComment.parent) {
        // reduce multi level depth to one depth
        HTTPForbidden();
      }
      comment.parent = parentComment;
    }
    comment.content = commentData.content;
    comment.post = post;
    comment.user = await UserEntity.getUser({ id: userId });

    await this.commentsRepository.save(comment);
    return new CommentSerializer(comment);
  }
  async getComments(
    query: CommentListQuery,
    postSlug: string,
  ): Promise<CommentSerializer[]> {
    const queryBuilder = this.commentsRepository.createQueryBuilder();

    queryBuilder
      .leftJoin('CommentEntity.post', 'PostEntity')
      .andWhere('PostEntity.slug = :slug', {
        slug: postSlug,
      });

    if (query.childrenOf) {
      queryBuilder.andWhere('CommentEntity.parent = :parentId', {
        parentId: query.childrenOf,
      });
    } else {
      queryBuilder
        .andWhere('CommentEntity.parent IS NULL')
        .loadRelationCountAndMap(
          'CommentEntity.countChild',
          'CommentEntity.childrens',
        );
    }
    queryBuilder.innerJoinAndSelect('CommentEntity.user', 'UserEntity');

    queryBuilder.offset(query.offset);
    queryBuilder.limit(query.limit);

    const comments = await queryBuilder.getMany();

    return (await comments).map((comment) => new CommentSerializer(comment));
  }

  async updateComment(
    userId: number,
    postSlug: string,
    commentId: number,
    commentData: CommentUpdateDto,
  ): Promise<CommentSerializer> {
    const queryBuilder = this.commentsRepository.createQueryBuilder();
    queryBuilder
      .where(`CommentEntity.id = :id AND CommentEntity.user = :userId`, {
        id: commentId,
        userId: userId,
      })
      .innerJoin('CommentEntity.post', 'post')
      .andWhere(`post.slug = :slug`, { slug: postSlug });

    queryBuilder.innerJoinAndSelect('CommentEntity.user', 'user');

    const comment = await queryBuilder.getOne();

    if (!comment) HTTP404();

    comment.content = commentData.content;
    await this.commentsRepository.save(comment);

    return new CommentSerializer(comment);
  }
  async deleteComment(userId: number, postSlug: string, commentId: number) {
    const queryBuilder = this.commentsRepository.createQueryBuilder();
    queryBuilder
      .where(`CommentEntity.id = :id AND CommentEntity.user = :userId`, {
        id: commentId,
        userId: userId,
      })
      .innerJoin('CommentEntity.post', 'post')
      .andWhere(`post.slug = :slug`, { slug: postSlug });
    const comment = await queryBuilder.getOne();

    if (!comment) HTTP404();
    await this.commentsRepository.remove(comment);
    return {
      message: 'Deleted successfully',
    };
  }
}
