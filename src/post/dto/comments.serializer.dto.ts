import { Exclude, Transform, Expose, plainToClass } from 'class-transformer';

import { UserMinimalSerializer } from 'src/user/dto/user.serializer';
import { CommentEntity } from '../post.entity';

@Exclude()
export class CommentSerializer {
  @Expose() id: number;
  @Expose() content: string;
  @Expose() numberOfChild?: number;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  // @Expose()
  // @Transform(({ value }) => new CommentSerializer(value))
  // childrens?: CommentSerializer[];

  constructor(partial: Partial<CommentSerializer>) {
    Object.assign(this, partial);
  }
}

function toObject(comment: CommentEntity): CommentSerializer {
  return plainToClass(CommentSerializer, comment, {
    enableImplicitConversion: true,
  });
}

export const CommentSerializeTree = (
  trees: CommentEntity[],
  results: CommentSerializer[],
) => {
  trees.forEach((tree: CommentEntity) => {
    const obj = toObject(tree);
    if (tree.childrens.length > 0)
      (obj as any).childrens = CommentSerializeTree(tree.childrens, []);
    results.push(obj);
  });
  return results;
};

export const CommentSerializeTreeV2 = (comments: CommentEntity[]) => {
  const results: CommentSerializer[] = [];
  comments.forEach((comment: CommentEntity) => {
    const obj = toObject(comment);
    (obj as any).childrens = [];
    if (comment.childrens.length > 0) {
      comment.childrens.forEach((childComment: CommentEntity) => {
        (obj as any).childrens.push(toObject(childComment));
      });
    }
    results.push(obj);
  });
  return results;
};
