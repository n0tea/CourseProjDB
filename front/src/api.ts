import axios from 'axios';
import { AppDispatch } from './redux/store';
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } from './redux/productsSlice';

export const fetchProducts = () => async (dispatch: AppDispatch) => {
    dispatch(fetchProductsStart());
    try {
        //const response = await axios.get('https://fakestoreapi.com/products?limit=10');
        const response = await axios.get('https://localhost:5000/api/Products/get');
        console.log(response.data);
        dispatch(fetchProductsSuccess(response.data));
    } catch (error: any) {
        dispatch(fetchProductsFailure(error.message));
    }
};