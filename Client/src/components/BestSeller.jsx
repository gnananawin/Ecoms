import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      <div className="flex flex-wrap gap-4 mt-4">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
