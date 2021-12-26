import { HTTP404 } from '../common/http.exceptions';
import { UserEntity } from './users.entity';

export const getUserObjOr404 = async (userId: number) => {
  const user = UserEntity.getRepository().findOne({ id: userId });

  if (!user) HTTP404();

  return user;
};
