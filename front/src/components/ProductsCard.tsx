
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Импортируем тип RootState, если он у вас есть
import { Product } from '../redux/productsSlice'; // Импортируем тип Product
import AddToCart from './AddToCartBtn';

interface ProductCardProps {
    id: number; 
}

export function ProductCard({ id }: ProductCardProps) {
    const product = useSelector((state: RootState) => state.products.items.find((p: Product) => p.id === id));
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString):0;

    if (!product) return <div className='text-2xl text-body'>Loading...</div>;

    return (
        <div className="border p-4 flex flex-col items-center">
            <img src={product.imageUrl/*product.imageUrl*/} alt={"нет картинки"} className="h-40" />
            <h4 className='font-body text-2xl'>{product.name}</h4>
            <span className='font-body text-2xl'>{product.price} руб</span>
            <AddToCart product={product} userId={userId}/>
        </div>
    );
}