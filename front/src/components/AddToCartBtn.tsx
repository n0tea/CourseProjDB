/*import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, fetchCartItems } from '../redux/cartSlice';
import { Product } from '../redux/productsSlice';
import { AppDispatch } from '../redux/store';

interface AddToCartProps {
  product: Product;
  userId: number;
}

const AddToCart: React.FC<AddToCartProps> = ({ product, userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = async () => {
    const { id: productId } = product;
    await dispatch(addToCart({ userId, productId, quantity: 1 }));
    dispatch(fetchCartItems(userId));
  };

  return (
    <button onClick={handleAddToCart} className="bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">
      Добавить
    </button>
  );
};

export default AddToCart;*/

// src/components/AddToCartBtn.tsx
import React from 'react';
import axios from 'axios';
import { Product } from '../redux/productsSlice';

import { toast } from 'react-toastify';

interface AddToCartProps {
    product: Product;
    userId: number;
}

const AddToCart: React.FC<AddToCartProps> = ({ product, userId }) => {
  const accessToken = localStorage.getItem('accessToken');

    const handleAddToCart = () => {
      axios.post(
        `https://localhost:5000/api/Cart/add/${userId}`, 
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
            .then(response => {
                console.log('Added to cart:');
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                toast.error('Сперва нужно зарегистрироваться и войти');
            });
    };

    return (
        <button onClick={handleAddToCart} className="bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">
            Add to Cart
        </button>
    );
};

export default AddToCart;



