
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  
interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCartItems = createAsyncThunk<CartItem[], number, { rejectValue: string }>(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get<CartItem[]>(`https://localhost:5000/api/Cart/get/${userId}`);
      console.log('API response:', response.data); // Лог данных с сервера
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch cart items');
    }
  }
);

export const addToCart = createAsyncThunk<void, { userId: number; productId: number; quantity: number }, { rejectValue: string }>(
  'cart/addToCart',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      await axios.post(`https://localhost:5000/api/Cart/add/${userId}`, { productId, quantity });
    } catch (error) {
      return rejectWithValue('Failed to add item to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk<void, { userId: number; productId: number }, { rejectValue: string }>(
  'cart/removeFromCart',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      await axios.delete(`https://localhost:5000/api/Cart/remove/${userId}/${productId}`);
    } catch (error) {
      return rejectWithValue('Failed to remove item from cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        console.log('Fetched cart items:', action.payload);  // Лог данных в state
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add item to cart';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to remove item from cart';
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
