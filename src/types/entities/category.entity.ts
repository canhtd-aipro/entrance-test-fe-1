import { Priority } from '../../enums/priority.enum';
import { BaseEntity } from './_base.entity';

export type CategoryEntity = BaseEntity & {
  name: string;
  priority: Priority;
};
