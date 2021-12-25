import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostVoteEntity } from './votes.entity';
import { PaginationQuery } from '../common/dto/common.query.dto';
import { PostVoteSerializer } from './dto/vote.serializer.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';

@Injectable()
export class CommentVotesService {
  constructor(
    @InjectRepository(PostVoteEntity)
    private postVotesRepository: Repository<PostVoteEntity>,
  ) {}

  async createCommentVote(
    userId: number,
    postSlug: string,
    commentId: number,
    voteData: VoteCreateUpdateDto,
  ): Promise<PostVoteEntity> {
    const postVote = new PostVoteEntity();
    console.log(userId, postSlug, commentId, voteData);

    await this.postVotesRepository.save(postVote);
    return postVote;
  }
  async getCommentVotes(
    query: PaginationQuery,
    postSlug: string,
    commentId: number,
  ): Promise<PostVoteSerializer[]> {
    const queryBuilder = this.postVotesRepository.createQueryBuilder();
    console.log(query, postSlug, commentId);
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    if (query.limit) {
      const limit = Math.min(query.limit, 50);
      queryBuilder.limit(limit);
    }

    const postVotes = await queryBuilder.getMany();

    return postVotes.map(
      (postVotes: PostVoteEntity) => new PostVoteSerializer(postVotes),
    );
  }

  async updateCommentVote(
    userId: number,
    postSlug: string,
    commentId: number,
    voteId: number,
    voteData: VoteCreateUpdateDto,
  ): Promise<PostVoteEntity> {
    const postVote = new PostVoteEntity();
    console.log(userId, postSlug, commentId, voteId, voteData);

    await this.postVotesRepository.save(postVote);
    return postVote;
  }
  async deleteCommentVote(
    userId: number,
    postSlug: string,
    commentId: number,
    voteId: number,
  ) {
    console.log(userId, postSlug, commentId, voteId);
    // TODO: filter postVote by userId and postSlug
    const postVote = await this.postVotesRepository.findOne({
      where: {
        id: voteId,
      },
    });
    if (!postVote) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (postVote.user.id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      await this.postVotesRepository.remove(postVote);
      return {
        message: 'Deleted successfully',
      };
    }
  }
}
