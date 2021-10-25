import { Injectable } from '@nestjs/common';
import { KeyObject } from '../common/types/common.type';

@Injectable()
export class PostsService {
  getPosts(): string[] {
    return ['Post one', 'Post tow', 'Post three'];
  }
  getPost(id: number): KeyObject {
    return { id: id };
  }
  delete(id: number): KeyObject {
    return { id: id };
  }
  create(data: KeyObject): KeyObject {
    return data;
  }
  update(id: number, data: KeyObject): KeyObject {
    return data;
  }
}
