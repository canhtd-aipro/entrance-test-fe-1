import { ItemDto } from '../types/common/item-dto.type';

export const itemDtoMapper = {
  getValueProps: (value: ItemDto[]) => ({ value: value?.map?.((e) => e.id) }),
  normalize: (value: number[]) => value.map((e) => ({ id: e })),
};
