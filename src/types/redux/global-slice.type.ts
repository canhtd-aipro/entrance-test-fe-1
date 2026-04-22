import { AppCaseReducers } from '../common/app-case-reducer.type';

export type GlobalState = {
  scale: number;
};

export type GlobalCaseReducers = AppCaseReducers<
  GlobalState,
  {
    setScale: number;
  }
>;
