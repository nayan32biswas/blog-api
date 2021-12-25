import { PostEntity } from './posts.entity';
import { HTTP404 } from '../common/exceptions';

export const getPublishedPost = () => {
  const queryBuilder = PostEntity.getRepository().createQueryBuilder();
  queryBuilder.andWhere(
    `((PostEntity.publishedAt IS NULL AND PostEntity.isPublished = true) OR (PostEntity.publishedAt IS NOT NULL AND PostEntity.publishedAt <= :publishedAt))`,
    { publishedAt: new Date() },
  );
  return queryBuilder;
};

export const getPublishedPostObjOr404 = async (slug: string) => {
  const queryBuilder = getPublishedPost();
  queryBuilder.andWhere('PostEntity.slug = :slug', { slug });
  const post = await queryBuilder.getOne();
  if (!post) HTTP404();

  return post;
};
