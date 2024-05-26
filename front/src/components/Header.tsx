import React, { useState, useEffect } from 'react';
import RegisterModal from './modals/RegisterModal';
import CartModal from './modals/CartModal';
import LoginModal from './modals/LoginModal';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { validateToken/*, login, logout */} from '../redux/authSlice';

//import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  backgroundImageUrl: string;
}

const Header: React.FC<HeaderProps> = ({ title, backgroundImageUrl }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && isLoginOpen) {
      setIsLoginOpen(false);
      setIsCartOpen(true);
    }
  }, [isAuthenticated, isLoginOpen]);

  const handleCartClick = () => {
    dispatch(validateToken()).then(() => {
      if (isAuthenticated) {
        setIsCartOpen(true);
      } else {
        setIsLoginOpen(true);
      }
    });
  };

  /*const handleInfoClick = () => {
    navigator('/info');
  };*/

  const closeModal = () => {
    setIsCartOpen(false);
    setIsRegisterOpen(false);
    setIsLoginOpen(false);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <header className="w-full h-screen/2 flex flex-col justify-center items-center bg-cover bg-center text-white" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: '100%' }}>
      <button className="fixed top-4 right-28 bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">INFO</button>
      <button className="fixed top-4 right-4 bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center" onClick={handleCartClick}>CART</button>
      
      <div className="mb-5 text-5xl text-gold font-body">{title}</div>

      {/* Modal for Login */}
      {isLoginOpen && <LoginModal closeModal={closeModal} openRegister={openRegister} />}

      {/* Modal for Register */}
      {isRegisterOpen && <RegisterModal closeModal={closeModal} />}

      {/* Modal for Cart */}
      {isCartOpen && <CartModal closeModal={closeModal} />}
    </header>
  );
};

export default Header;
