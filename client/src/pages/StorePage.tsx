import { useParams } from 'react-router-dom';
import ProductGrid from '../components/shop/ProductGrid';

export default function StorePage() {
  const { storeId } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">
          {storeId === 'all' ? (
            <>Browse <span className="gradient-text">All Products</span></>
          ) : (
            <span className="gradient-text capitalize">{storeId}</span>
          )}
        </h1>
        <p className="text-dark-200">
          Try everything on your digital twin before buying. Perfect fit guaranteed.
        </p>
      </div>
      <ProductGrid />
    </div>
  );
}
