import { KeyObject } from 'src/common/types/common.type';
import { HTTP404 } from '../common/http.exceptions';
import { UserEntity } from './user.entity';

export const getUserObjOr404 = async (userId: number) => {
  const user = await UserEntity.getRepository().findOne({ id: userId });
  if (!user) HTTP404();
  return user;
};

export const getUser = async (filter: KeyObject) => {
  return await UserEntity.getRepository().findOne(filter);
};
