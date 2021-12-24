import { randomString, slugify } from './strings';
import * as _ from 'lodash';

import { KeyObject } from '../types/common.type';

export const generateSlug = async (
  modelRepository: any,
  value: string,
  dist: string,
) => {
  let slug = slugify(value);
  let res;
  while (true) {
    res = await modelRepository.findOne({ [dist]: slug });
    if (!res) break;
    else slug += randomString(2);
  }
  return slug;
};

export const getImage = (files: KeyObject | undefined, key: string) => {
  if (files !== undefined && files[key]?.length) {
    return _.first(files[key]);
  }
  return undefined;
};
