import { toAlphabet } from '../common/utils/strings';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity as _BaseEntity,
  In,
} from 'typeorm';

@Entity({ name: 'tag' })
export class TagEntity extends _BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  static async createOrGetTags(payloadTags: Array<string>) {
    const tagsRepository = this.getRepository();
    const tags = payloadTags.map((tag: string) => toAlphabet(tag));

    const existingTags = await tagsRepository.find({ name: In(tags) });
    const tempTags = [...existingTags];
    tags.forEach((tag: string) => {
      const exists = existingTags.some(
        (tagData: TagEntity) => tagData.name === tag,
      );
      if (!exists) {
        const newTag = new TagEntity();
        newTag.name = tag;
        newTag.save();
        tempTags.push(newTag);
      }
    });
    return tempTags;
  }
}
