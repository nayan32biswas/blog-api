import { randomString, slugify } from './strings';

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
