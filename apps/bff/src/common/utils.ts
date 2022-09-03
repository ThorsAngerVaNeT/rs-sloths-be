import { WhereField, WhereFieldFilter } from '../app.interfaces';

export const getSearchStringWhereProperty = (field: string, value: string): WhereField => ({
  [field]: {
    contains: value,
    mode: 'insensitive',
  },
});

export const getFilterInWhereProperty = (field: string, value: string[]): WhereField => ({
  [field]: { in: value },
});

export const getORFields = (fields: WhereField[]): WhereFieldFilter | WhereField | null => {
  const arr = fields.filter((el) => el !== null);

  if (!arr.length) return null;
  if (arr.length === 1) return arr[0];
  return { OR: arr };
};

export const getANDFields = (fields: (WhereFieldFilter | WhereField | null)[]) => {
  const arr = fields.filter((el) => el !== null);

  if (!arr.length) return null;
  if (arr.length === 1) return arr[0];
  return { AND: arr };
};

export const getWhere = (
  searchText: string,
  searchFields: string[],
  filterValues: string[],
  filterFields: string[]
) => {
  const search: WhereFieldFilter | WhereField | null = searchText
    ? getORFields(searchFields.map((field) => getSearchStringWhereProperty(field, searchText)))
    : null;

  const select: WhereFieldFilter | WhereField | null = filterValues.length
    ? getORFields(filterFields.map((field) => getFilterInWhereProperty(field, filterValues)))
    : null;

  return getANDFields([search, select]);
};
