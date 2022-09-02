import { GetAllConditions } from './app.interfaces';

export const getPrismaOptions = (params: GetAllConditions) => {
  const { page = 1, limit, cursor, where, orderBy } = params;

  const take = limit || undefined;
  const skip = take ? (page - 1) * take : undefined;
  const conditions = {
    cursor,
    where,
    orderBy,
  };

  return { take, skip, conditions };
};
