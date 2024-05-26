import React, { useState } from "react";
import axios from "axios";

interface RegisterModalProps {
    closeModal: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ closeModal }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Для отображения ошибок

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const model = {
            Username: username,
            Email: email,
            Password: password,
        };

        try {
            const response = await axios.post("https://localhost:5000/api/Auth/register", model);
            console.log(response.data);
            closeModal();
        } catch (error) {
            setError('Произошла ошибка при регистрации. Попробуйте снова.');
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-black font-body text-2xl mb-4">Регистрация</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>} {/* Отображение ошибок */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-black font-body text-xl" htmlFor="username">Имя пользователя:</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full border border-gray-300 p-2 rounded text-black"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
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
                    <button type="submit" className="bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">Зарегистрироваться</button>
                </form>
                <button onClick={closeModal} className="mt-4 bg-gold border-3 border-red-500 px-2 py-1 text-black font-body text-2xl rounded-full flex items-center justify-center">Закрыть</button>
            </div>
        </div>
    );
};

export default RegisterModal;
