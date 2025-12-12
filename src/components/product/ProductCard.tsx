'use client';
import { IProduct } from '@/interfaces/IProduct';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import PriceDisplay from '@/helper/covertMoney';


export default function ProductCard({ product }: { product: IProduct }) {
    

  return (
    <div className='group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full'>
      <div className='relative h-48 w-full overflow-hidden bg-gray-100'>
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
        />
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button className='p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500'>
            <Heart className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='p-4 flex flex-col flex-1'>
        <h3 className='font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors'>
          {product.name}
        </h3>

        <div className='mt-auto pt-3 border-t border-gray-50 flex items-center justify-between'>
          <PriceDisplay
            value={product.price}
            className='text-lg font-bold text-blue-600'
          />
        </div>
        <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
          <Link href={`/san-pham/${product.slug}`} className='block w-full'>
            Xem chi tiết
          </Link>
        </Button>
      </div>
    </div>
  );
};
