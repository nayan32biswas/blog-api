import { Injectable } from '@nestjs/common';
import { KeyObject } from '../types/common.type';

@Injectable()
export class PostService {
  getPosts(): string[] {
    return ['Post one', 'Post tow', 'Post three'];
  }
  getPost(id: string): KeyObject {
    return { id: id };
  }
  delete(id: string): KeyObject {
    return { id: id };
  }
  create(data: KeyObject): KeyObject {
    return data;
  }
  update(id: string, data: KeyObject): KeyObject {
    return data;
  }
}
