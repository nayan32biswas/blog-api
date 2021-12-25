import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './comments.entity';
import { CommentCreateUpdateDto } from './dto/comments.body.dto';
import { CommentListQuery } from './dto/comments.urlParser.dto';
import { CommentSerializer } from './dto/comments.serializer.dto';
import { PostEntity } from 'src/posts/posts.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
  ) {}

  async create(
    userId: number,
    postSlug: string,
    commentData: CommentCreateUpdateDto,
  ): Promise<PostEntity> {
    const comment = new PostEntity();
    console.log(userId, postSlug, commentData);

    await this.commentsRepository.save(comment);
    return comment;
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

    const comments = await queryBuilder.getMany();

    return comments.map(
      (comments: CommentEntity) => new CommentSerializer(comments),
    );
  }

  async update(
    userId: number,
    postSlug: string,
    commentId: number,
    commentData: CommentCreateUpdateDto,
  ): Promise<PostEntity> {
    const comment = new PostEntity();
    console.log(userId, postSlug, commentId, commentData);

    await this.commentsRepository.save(comment);
    return comment;
  }
  async delete(userId: number, postSlug: string, commentId: number) {
    console.log(userId, postSlug, commentId);
    // TODO: filter comment by userId and postSlug
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (comment.user.id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      await this.commentsRepository.remove(comment);
      return {
        message: 'Deleted successfully',
      };
    }
  }
}
