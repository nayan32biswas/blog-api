import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './comments.entity';
import { CommentCreateDto, CommentUpdateDto } from './dto/comments.body.dto';
import { CommentListQuery } from './dto/comments.urlParser.dto';
import { CommentSerializer } from './dto/comments.serializer.dto';
import { getPublishedPostObjOr404 } from '../posts/query.manager';
import { UserEntity } from 'src/users/users.entity';
import { HTTP404, HTTPForbidden } from '../common/exceptions';

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
    console.log(query, postSlug);
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    if (query.limit) {
      const limit = Math.min(query.limit, 50);
      queryBuilder.limit(limit);
    }
    queryBuilder.innerJoinAndSelect('CommentEntity.user', 'user');

    const comments = await queryBuilder.getMany();

    return comments.map(
      (comments: CommentEntity) => new CommentSerializer(comments),
    );
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
