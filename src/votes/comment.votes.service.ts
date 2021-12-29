import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentVoteEntity } from './votes.entity';
import { PaginationQuery } from '../common/dto/common.query.dto';
import { CommonVoteSerializer } from './dto/vote.serializer.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';
import { HTTP404 } from '../common/http.exceptions';
import { getUserObjOr404 } from '../users/query.manager';
import { CommentEntity } from '../comments/comments.entity';

@Injectable()
export class CommentVotesService {
  constructor(
    @InjectRepository(CommentVoteEntity)
    private commentVotesRepository: Repository<CommentVoteEntity>,
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

    let commentVote = await this.commentVotesRepository.findOne({
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
    await this.commentVotesRepository.save(commentVote);

    return new CommonVoteSerializer(commentVote);
  }
  async getCommentVotes(
    query: PaginationQuery,
    commentId: number,
  ): Promise<CommonVoteSerializer[]> {
    const queryBuilder = this.commentVotesRepository
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
    const commentVote = await this.commentVotesRepository
      .createQueryBuilder()
      .where(
        `CommentVoteEntity.comment = :commentId AND CommentVoteEntity.user = :userId`,
        { commentId, userId },
      )
      .getOne();

    if (commentVote) {
      await this.commentVotesRepository.remove(commentVote);
      return {
        message: 'Deleted successfully',
      };
    } else {
      HTTP404();
    }
  }
}
