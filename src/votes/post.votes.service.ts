import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostVoteEntity } from './votes.entity';
import { PaginationQuery } from '../common/dto/common.query.dto';
import { PostVoteSerializer } from './dto/vote.serializer.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';

@Injectable()
export class PostVotesService {
  constructor(
    @InjectRepository(PostVoteEntity)
    private postVotesRepository: Repository<PostVoteEntity>,
  ) {}

  async createPostVote(
    userId: number,
    postSlug: string,
    voteData: VoteCreateUpdateDto,
  ): Promise<PostVoteEntity> {
    const postVote = new PostVoteEntity();
    console.log(userId, postSlug, voteData);

    await this.postVotesRepository.save(postVote);
    return postVote;
  }
  async getPostVotes(
    query: PaginationQuery,
    postSlug: string,
  ): Promise<PostVoteSerializer[]> {
    const queryBuilder = this.postVotesRepository.createQueryBuilder();
    console.log(query, postSlug);
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

  async updatePostVote(
    userId: number,
    postSlug: string,
    voteId: number,
    voteData: VoteCreateUpdateDto,
  ): Promise<PostVoteEntity> {
    const postVote = new PostVoteEntity();
    console.log(userId, postSlug, voteId, voteData);

    await this.postVotesRepository.save(postVote);
    return postVote;
  }
  async deletePostVote(userId: number, postSlug: string, voteId: number) {
    console.log(userId, postSlug, voteId);
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
