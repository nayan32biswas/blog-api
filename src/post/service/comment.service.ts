import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from '../post.entity';
import { CommentCreateDto, CommentUpdateDto } from '../dto/comments.body.dto';
import { CommentSerializer } from '../dto/comments.serializer.dto';
import { UserEntity } from 'src/user/user.entity';
import { HTTP404, HTTPForbidden } from 'src/common/http.exceptions';
import { CommentListQuery } from '../dto/comments.urlParser.dto';
import { getPublishedPostObjOr404 } from '../post.query-manager';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    userId: number,
    postSlug: string,
    commentData: CommentCreateDto,
  ): Promise<CommentSerializer> {
    const post = await getPublishedPostObjOr404(postSlug);

    const comment = new CommentEntity();

    if (commentData.parentId) {
      const parentComment = await this.commentRepository.findOne({
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

    await this.commentRepository.save(comment);
    return new CommentSerializer(comment);
  }
  async getComments(
    query: CommentListQuery,
    postSlug: string,
  ): Promise<CommentSerializer[]> {
    const queryBuilder = this.commentRepository.createQueryBuilder();

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
          'CommentEntity.numberOfChild',
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
    const queryBuilder = this.commentRepository.createQueryBuilder();
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
    await this.commentRepository.save(comment);

    return new CommentSerializer(comment);
  }
  async deleteComment(userId: number, postSlug: string, commentId: number) {
    const queryBuilder = this.commentRepository.createQueryBuilder();
    queryBuilder
      .where(`CommentEntity.id = :id AND CommentEntity.user = :userId`, {
        id: commentId,
        userId: userId,
      })
      .innerJoin('CommentEntity.post', 'post')
      .andWhere(`post.slug = :slug`, { slug: postSlug });
    const comment = await queryBuilder.getOne();

    if (!comment) HTTP404();
    await this.commentRepository.remove(comment);
    return {
      message: 'Deleted successfully',
    };
  }
}
