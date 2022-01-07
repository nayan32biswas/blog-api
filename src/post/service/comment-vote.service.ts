import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationQuery } from 'src/common/dto/common.query.dto';
import { HTTP404 } from 'src/common/http.exceptions';
import { getUserObjOr404 } from 'src/user/user.query-manager';
import { VoteCreateUpdateDto } from '../dto/vote.body.dto';
import { CommonVoteSerializer } from '../dto/vote.serializer.dto';
import { CommentVoteEntity, CommentEntity } from '../post.entity';

@Injectable()
export class CommentVoteService {
  constructor(
    @InjectRepository(CommentVoteEntity)
    private commentVoteRepository: Repository<CommentVoteEntity>,
  ) {}
  async createOrUpdateCommentVote(
    userId: number,
    postSlug: string,
    commentId: number,
    voteData: VoteCreateUpdateDto,
  ): Promise<CommonVoteSerializer> {
    const comment = await CommentEntity.getRepository()
      .createQueryBuilder()
      .innerJoin('CommentEntity.post', 'PostEntity')
      .where(`CommentEntity.id = :commentId AND PostEntity.slug = :postSlug`, {
        commentId,
        postSlug,
      })
      .getOne();
    if (!comment) HTTP404();

    let commentVote = await this.commentVoteRepository.findOne({
      where: {
        comment: comment.id,
        user: userId,
      },
      relations: ['user'],
    });

    if (commentVote === undefined) {
      const user = await getUserObjOr404(userId);
      commentVote = new CommentVoteEntity();
      commentVote.comment = comment;
      commentVote.user = user;
    }

    commentVote.type = voteData.type;
    await this.commentVoteRepository.save(commentVote);

    return new CommonVoteSerializer(commentVote);
  }
  async getCommentVotes(
    query: PaginationQuery,
    commentId: number,
  ): Promise<CommonVoteSerializer[]> {
    const queryBuilder = this.commentVoteRepository
      .createQueryBuilder()
      .where(`CommentVoteEntity.comment = :commentId`, {
        commentId: commentId,
      })
      .innerJoinAndSelect('CommentVoteEntity.user', 'UserEntity');

    queryBuilder.offset(query.offset);
    queryBuilder.limit(query.limit);

    const commentVotes = await queryBuilder.getMany();
    return commentVotes.map(
      (commentVotes: CommentVoteEntity) =>
        new CommonVoteSerializer(commentVotes),
    );
  }

  async deleteCommentVote(userId: number, commentId: number) {
    const commentVote = await this.commentVoteRepository
      .createQueryBuilder()
      .where(
        `CommentVoteEntity.comment = :commentId AND CommentVoteEntity.user = :userId`,
        { commentId, userId },
      )
      .getOne();

    if (commentVote) {
      await this.commentVoteRepository.remove(commentVote);
      return {
        message: 'Deleted successfully',
      };
    } else {
      HTTP404();
    }
  }
}
