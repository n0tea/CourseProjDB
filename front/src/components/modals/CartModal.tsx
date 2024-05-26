// src/components/CartModal.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

//import { useSelector } from 'react-redux';
//import { RootState } from '../../redux/store';
//import { RootState } from '@reduxjs/toolkit/query';

interface CartItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface CartModalProps {
    //userId: number;
    //isOpen: boolean;
    closeModal: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ closeModal }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    //const userId = useSelector((state: RootState) => state.auth.user?.id);
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString):0;

    const accessToken = localStorage.getItem('accessToken');
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const handleRemove = async (productId: number) => {
      if (userId) {
          try {
              await axios.delete(`https://localhost:5000/api/Cart/remove/${userId}/${productId}`, axiosConfig);
              fetchCartItems(); // Refresh cart items after removal
          } catch (error) {
              console.error('Error removing cart item:', error);
          }
      }
  };

    const fetchCartItems = async() => {
      axios.get(`https://localhost:5000/api/Cart/get/${userId}`, axiosConfig)
        .then(response => {
          setCartItems(response.data);
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
        });
    }

    const handlePurchase = async () => {
      try {
        await axios.post(`https://localhost:5000/api/Orders/${userId}`, {
          deliveryAddress: 'Sample Address' // Replace with actual address input from user
        }, axiosConfig);
        toast.success('Товары успешно приобретены');
        closeModal();
      } catch (error) {
          toast.error('Ошибка при покупке товаров: корзина пуста');
      }
    };

    useEffect(() => {
      fetchCartItems();
    }, [userId]);

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-black font-body text-2xl mb-4">Корзина товаров</h2>
        {cartItems.length === 0 ? (
          <p className="text-black font-body text-xl">Ваша корзина пуста</p>
        ) : (
          <ul>
            {cartItems.map((item: CartItem) => (
              <li key={item.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-black font-body text-xl">{item.productName}</p>
                    <p className="text-black font-body text-xl">{item.price} руб x {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cartItems.length > 0 && (
          <button
            onClick={handlePurchase}
            className="mt-4 bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center"
          >
            Купить
          </button>
        )}
        <button
          onClick={closeModal}
          className="mt-4 bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default CartModal;


