import Header from '../components/Header';
import { ProductsSection } from '../components/ProductsSection';

function HomePage() {
    return (
        <div>
            <Header title={'84fabe'} backgroundImageUrl={'/src/img/krut_hoh.png'} /> {/*isAuthenticated={true}*/}
            <ProductsSection />
        </div>
    );
}

export default HomePage;
