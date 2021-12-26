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
  ): Promise<CommentEntity> {
    const comment = new CommentEntity();
    console.log(userId, postSlug, commentId, commentData);

    await this.commentsRepository.save(comment);
    return comment;
  }
  async deleteComment(userId: number, postSlug: string, commentId: number) {
    console.log(userId, postSlug, commentId);
    // TODO: filter comment by userId and postSlug
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    if (!comment) HTTP404();
    else if (comment.user.id !== userId) HTTPForbidden();
    else {
      await this.commentsRepository.remove(comment);
      return {
        message: 'Deleted successfully',
      };
    }
  }
}
