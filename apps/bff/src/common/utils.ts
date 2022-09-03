import { GetWhereInput, WhereField, WhereFieldFilter } from '../app.interfaces';

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

export const getWhere = ({ searchText, searchFields, filterValues, filterFields }: GetWhereInput) => {
  const search: WhereFieldFilter | WhereField | null =
    searchText && searchFields
      ? getORFields(searchFields.map((field) => getSearchStringWhereProperty(field, searchText)))
      : null;

  const select: WhereFieldFilter | WhereField | null =
    filterValues?.length && filterFields?.length
      ? getORFields(
          filterFields.map((field) => {
            if (typeof field === 'string') {
              return getFilterInWhereProperty(field, filterValues);
            }
            const [nested, nestedField] = field;
            return {
              [nested]: { some: { ...getFilterInWhereProperty(nestedField, filterValues) } },
            };
          })
        )
      : null;

  return getANDFields([search, select]);
};
