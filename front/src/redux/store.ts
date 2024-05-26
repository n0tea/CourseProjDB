import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { productsSlice } from './productsSlice';
import cartReducer /*{ cartSlice }*/ from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    //cart: cartSlice.reducer,
    cart: cartReducer,
    products: productsSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;