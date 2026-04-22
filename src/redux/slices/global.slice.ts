import { createSlice } from '@reduxjs/toolkit';
import { GlobalCaseReducers, GlobalState } from '../../types/redux/global-slice.type';

const initialState: GlobalState = {
  scale: 1,
};

export const { reducer: globalReducer, actions: globalActions } = createSlice<GlobalState, GlobalCaseReducers>({
  name: 'global',
  initialState,
  reducers: {
    setScale(state, action) {
      return {
        ...state,
        scale: action.payload,
      };
    },
  },
});
