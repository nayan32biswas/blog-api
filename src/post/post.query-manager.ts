import { PostEntity } from './post.entity';
import { HTTP404 } from '../common/http.exceptions';

export const getPublishedPost = () => {
  const queryBuilder = PostEntity.getRepository().createQueryBuilder();
  queryBuilder.andWhere(
    `((PostEntity.published_at IS NULL AND PostEntity.is_published = true) OR (PostEntity.published_at IS NOT NULL AND PostEntity.published_at <= :published_at))`,
    { published_at: new Date() },
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
