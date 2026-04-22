import { BaseEntity } from './_base.entity';

export type TodoEntity = BaseEntity & {
  name: string;
  description?: string | null;
  deadline?: string | null;
};
