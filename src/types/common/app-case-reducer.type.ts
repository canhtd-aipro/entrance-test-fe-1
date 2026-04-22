import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';

type AppCaseReducer<S, P = any> = CaseReducer<S, PayloadAction<P>>;

export type AppCaseReducers<S, C> = {
  [K: string]: AppCaseReducer<S>;
} & {
  [K in keyof C]: AppCaseReducer<S, C[K]>;
};
