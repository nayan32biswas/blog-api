import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';

import { PostVoteEntity } from './votes.entity';
import { PaginationQuery } from '../common/dto/common.query.dto';
import { PostVoteSerializer } from './dto/vote.serializer.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';
import { HTTP404, HTTPForbidden } from '../common/http.exceptions';
import { getPublishedPostObjOr404 } from '../posts/query.manager';
import { getUserObjOr404 } from '../users/query.manager';

@Injectable()
export class PostVotesService {
  constructor(
    @InjectRepository(PostVoteEntity)
    private postVotesRepository: Repository<PostVoteEntity>,
  ) {}

  async createOrUpdatePostVote(
    userId: number,
    postSlug: string,
    voteData: VoteCreateUpdateDto,
  ): Promise<PostVoteSerializer> {
    const post = await getPublishedPostObjOr404(postSlug);

    let postVote = await this.postVotesRepository.findOne({
      where: {
        post: post.id,
        user: userId,
      },
      relations: ['user'],
    });

    if (postVote === undefined) {
      const user = await getUserObjOr404(userId);
      postVote = new PostVoteEntity();
      postVote.post = post;
      postVote.user = user;
    }

    postVote.type = voteData.type;

    await this.postVotesRepository.save(postVote);
    return new PostVoteSerializer(postVote);
  }
  async getPostVotes(
    query: PaginationQuery,
    postSlug: string,
  ): Promise<PostVoteSerializer[]> {
    const queryBuilder = this.postVotesRepository
      .createQueryBuilder()
      .innerJoin('PostVoteEntity.post', 'PostEntity')
      .where(`PostEntity.slug = :slug`, { slug: postSlug })
      .innerJoinAndSelect('PostVoteEntity.user', 'UserEntity');

    console.log('no error found');

    queryBuilder.offset(query.offset);
    queryBuilder.limit(query.limit);

    const postVotes = await queryBuilder.getMany();

    return postVotes.map(
      (postVotes: PostVoteEntity) => new PostVoteSerializer(postVotes),
    );
  }

  async deletePostVote(userId: number, postSlug: string, voteId: number) {
    console.log(userId, postSlug, voteId);
    // TODO: filter postVote by userId and postSlug
    const queryBuilder = this.postVotesRepository
      .createQueryBuilder()
      .innerJoin('PostVoteEntity.post', 'PostEntity')
      .where(
        `PostVoteEntity.id = :id AND PostVoteEntity.userId = :userID AND PostEntity.slug = :slug`,
        { id: voteId, userId: userId, slug: postSlug },
      );

    const postVote = await queryBuilder.getOne();

    if (!postVote) HTTP404();
    else {
      await this.postVotesRepository.remove(postVote);
      return {
        message: 'Deleted successfully',
      };
    }
  }
}
