import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

// getStore is a factory method that creates a new store
export function getStore() {
  return configureStore({
    reducer: {
      todo: todoReducer,
    },
  });
}

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
