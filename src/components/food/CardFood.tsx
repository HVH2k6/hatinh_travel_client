'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowUpRight } from 'lucide-react'; // Thêm icon Arrow
import { IAttraction } from '@/interfaces/IAttraction';
import PriceDisplay from '@/helper/covertMoney';
import { IFood } from '@/interfaces/IFood';

type Props = { food: IFood };

export default function CardFood({ food }: Props) {
  const { slug, name, image, address, price } = food;

  // Xử lý địa chỉ: Chỉ lấy Quận/Huyện, Tỉnh để ngắn gọn hơn cho card du lịch
  const location =
    [address?.wardId?.name, address?.provinceId?.name]
      .filter(Boolean)
      .join(', ') || 'Đang cập nhật';

  const href = `/dac-san/${slug}`;

  return (
    <Link
      href={href}
      prefetch
      className='group block h-full focus:outline-none'
    >
      <Card
        className='
          relative flex h-full flex-col overflow-hidden rounded-xl border-0 bg-white shadow-sm
          transition-all duration-500 ease-out
          hover:-translate-y-1 hover:shadow-xl
          dark:bg-slate-900
        '
      >
        {/* --- IMAGE AREA --- */}
        <div className='relative aspect-[4/3] w-full overflow-hidden'>
          {image ? (
            <Image
              src={image}
              alt={name || 'Đặc sản Hà Tĩnh'}
              fill
              loading='lazy'
              className='object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
              sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            />
          ) : (
            <div className='grid h-full w-full place-content-center bg-slate-100 text-slate-400'>
              <span className='text-4xl'>🍽️</span>
            </div>
          )}

          {/* Overlay gradient nhẹ ở đáy ảnh để làm nổi badge nếu cần */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40' />

          {/* PRICE BADGE - Đặt nổi bật góc trên */}
          <div className='absolute right-3 top-3 z-10'>
            <Badge className='bg-white/95 text-slate-900 shadow-md hover:bg-white backdrop-blur-sm px-3 py-1.5 border-0'>
              <span className='mr-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider'>
                Từ
              </span>
              <PriceDisplay
                value={price}
                className='text-sm font-bold text-orange-600' // Màu cam kích thích ăn uống
                unitClassName='text-[10px] font-normal text-slate-500 ml-0.5'
              />
            </Badge>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <CardContent className='flex flex-col gap-2 p-5'>
          {/* Tên món ăn */}
          <h3
            className='
              line-clamp-2 text-lg font-bold leading-tight text-slate-800 
              transition-colors group-hover:text-primary
              dark:text-slate-100
            '
            title={name}
          >
            {name}
          </h3>

          {/* Địa chỉ */}
          <div className='flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400'>
            <MapPin className='h-3.5 w-3.5 shrink-0 text-primary/70' />
            <span className='line-clamp-1 font-medium'>{location}</span>
          </div>
        </CardContent>

        {/* --- FOOTER / CTA --- */}
        <CardFooter className='mt-auto px-5 pb-5 pt-0'>
            {/* Nút Xem chi tiết cách điệu */}
            <div className='flex w-full items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
                <span className='text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-primary transition-colors'>
                    Khám phá ngay
                </span>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-45 dark:bg-slate-800'>
                    <ArrowUpRight className='h-4 w-4' />
                </div>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}