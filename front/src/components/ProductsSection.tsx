import  { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { fetchProducts } from '../api';
import { ProductCard } from './ProductsCard';

export function ProductsSection() {
    const dispatch = useAppDispatch();
    const { items: products, loading, error } = useAppSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="grid grid-cols-2 gap-4 mt-5">
        {products.map(product => (
            <ProductCard key={product.id} id={product.id} />
        ))}
        </div>
    );
}