import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: number;
    name: string;
    price: number;
    //imageUrl: string;
    imageUrl: string;
}

export interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null
};

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProductsStart: state => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.loading = false;
        },
        fetchProductsFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = productsSlice.actions;