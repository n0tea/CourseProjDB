import React, { useState } from 'react';
import axios from 'axios';

interface LoginModalProps {
    closeModal: () => void;
    openRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal, openRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    //const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://localhost:5000/api/Auth/login', { email, password });
            console.log(response.data)
            const { accessToken } = response.data;
            if (accessToken) {
                //login(accessToken);
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userId', response.data.userId)
                closeModal();
                window.location.reload();
            } else {
                setError('Не удалось получить токен. Попробуйте снова.');
            }
        } catch (err) {
            setError('Неправильные email или пароль. Попробуйте снова.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-black font-body text-2xl mb-4">Вход</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-1 text-black font-body text-xl" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border border-gray-300 p-2 rounded text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-black font-body text-xl" htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-gray-300 p-2 rounded text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">Войти</button>
                </form>
                <p>
                    <span className="mt-4 text-black font-body text-xl">Нет аккаунта?</span>
                    <span onClick={openRegister} className="text-red-800 font-body text-xl cursor-pointer">Создать</span>
                </p>
                <button onClick={closeModal} className="bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">Закрыть</button>
            </div>
        </div>
    );
};

export default LoginModal;
