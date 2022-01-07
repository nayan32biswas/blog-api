import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HTTP404 } from 'src/common/http.exceptions';
import { getUserObjOr404 } from 'src/user/user.query-manager';
import { PaginationQuery } from 'src/common/dto/common.query.dto';
import { PostVoteEntity } from '../post.entity';
import { VoteCreateUpdateDto } from '../dto/vote.body.dto';
import { CommonVoteSerializer } from '../dto/vote.serializer.dto';
import { getPublishedPostObjOr404 } from '../post.query-manager';

@Injectable()
export class PostVoteService {
  constructor(
    @InjectRepository(PostVoteEntity)
    private postVoteRepository: Repository<PostVoteEntity>,
  ) {}

  async createOrUpdatePostVote(
    userId: number,
    postSlug: string,
    voteData: VoteCreateUpdateDto,
  ): Promise<CommonVoteSerializer> {
    const post = await getPublishedPostObjOr404(postSlug);

    let postVote = await this.postVoteRepository.findOne({
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

    await this.postVoteRepository.save(postVote);
    return new CommonVoteSerializer(postVote);
  }
  async getPostVotes(
    query: PaginationQuery,
    postSlug: string,
  ): Promise<CommonVoteSerializer[]> {
    const queryBuilder = this.postVoteRepository
      .createQueryBuilder()
      .innerJoin('PostVoteEntity.post', 'PostEntity')
      .where(`PostEntity.slug = :slug`, { slug: postSlug })
      .innerJoinAndSelect('PostVoteEntity.user', 'UserEntity');

    queryBuilder.offset(query.offset);
    queryBuilder.limit(query.limit);

    const postVotes = await queryBuilder.getMany();

    return postVotes.map(
      (postVotes: PostVoteEntity) => new CommonVoteSerializer(postVotes),
    );
  }

  async deletePostVote(userId: number, postSlug: string) {
    const queryBuilder = this.postVoteRepository
      .createQueryBuilder()
      .innerJoin('PostVoteEntity.post', 'PostEntity')
      .where(
        `PostVoteEntity.userId = :userId AND PostEntity.slug = :postSlug`,
        { userId, postSlug },
      );

    const postVote = await queryBuilder.getOne();

    if (postVote) {
      await this.postVoteRepository.remove(postVote);
      return {
        message: 'Deleted successfully',
      };
    } else {
      HTTP404();
    }
  }
}
