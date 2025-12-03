'use client';

import { IFood } from '@/interfaces/IFood';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ChefHat, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import ExpandableDescription from '@/components/content/ContentLoad';
import PriceDisplay from '@/helper/covertMoney';

interface IFoodDetailProps {
  food: IFood;
  isLoading?: boolean;
}

export default function FoodDetail({ food, isLoading }: IFoodDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const address =
    `${food.address.detail && food.address.detail + ', '} ${food.address.wardId.name}, ${food.address.districtId.name}, ${food.address.provinceId.name}`;

  const allImages = [food.image, ...food.list_image];
  const price = Number(food.price || 0);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white p-8'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse'>
          <div className='h-[500px] bg-slate-100 rounded-xl'></div>
          <div className='space-y-4'>
            <div className='h-8 w-3/4 bg-slate-100 rounded'></div>
            <div className='h-6 w-1/4 bg-slate-100 rounded'></div>
            <div className='h-32 w-full bg-slate-100 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white text-slate-900 pb-20 pt-8'>
      <div className='container max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-12 gap-10'>
          
          {/* --- LEFT COLUMN: IMAGES & DESCRIPTION (Chiếm 7 phần) --- */}
          <div className='lg:col-span-7 space-y-10'>
            {/* 1. Image Gallery */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='space-y-4'
            >
              {/* Main Image */}
              <div className='relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50'>
                <Image
                  src={allImages[selectedImage]}
                  alt={food.name}
                  fill
                  className='object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in'
                  priority
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${
                        selectedImage === index
                          ? 'border-black ring-1 ring-black opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumb-${index}`}
                        fill
                        className='object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 2. Description Section */}
            <div className='prose prose-slate max-w-none'>
              <h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                <ChefHat className='w-5 h-5 text-slate-500' />
                Câu chuyện món ăn
              </h3>
              <div className='text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl'>
                <ExpandableDescription
                  content={food.description}
                  maxHeight={200}
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: INFO STICKY (Chiếm 5 phần) --- */}
          <div className='lg:col-span-5'>
            <div className='sticky top-24 space-y-8'>
              
              {/* Header Info */}
              <div className='space-y-4'>
                <Badge variant="secondary" className='bg-slate-100 text-slate-600 hover:bg-slate-200'>
                  Đặc sản Hà Tĩnh
                </Badge>
                
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900'>
                  {food.name}
                </h1>

                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-semibold text-primary'>
                    <PriceDisplay value={price} />
                  </span>
                  <span className='text-sm text-slate-400'>/ phần</span>
                </div>
              </div>

              <Separator />

              {/* Ingredients */}
              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2'>
                  <Utensils className='w-4 h-4' /> Nguyên liệu chính
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {food.ingredients.split(',').map((item, idx) => (
                    <span 
                      key={idx} 
                      className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700'
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className='text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2'>
                  <MapPin className='w-4 h-4' /> Địa điểm thưởng thức
                </h4>
                <div className='bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow'>
                  <p className='text-slate-700 leading-relaxed'>
                    {address}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 mt-2 hover:underline"
                  >
                    Xem trên Google Maps &rarr;
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}