'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowUpRight, Palette } from 'lucide-react';
import { IArt } from '@/interfaces/IArt';

type Props = { art: IArt };

export default function CardArt({ art }: Props) {
  const { slug, name, image, address, categoryId } = art;
  console.log(">>>>>> card:",art); 

  // Xử lý địa chỉ: Chỉ lấy Quận/Huyện, Tỉnh
  const location =
    [address?.wardId?.name, address?.provinceId?.name]
      .filter(Boolean)
      .join(', ') || 'Đang cập nhật';

  const href = `/van-hoa-nghe-thuat/${slug}`;

  return (
    <Link
      href={href}
      prefetch
      className='group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl'
    >
      <Card
        className='
          relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/60
          bg-white shadow-md
          transition-all duration-500 ease-out
          hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30
          dark:bg-slate-900 dark:border-slate-800
        '
      >
        {/* --- IMAGE AREA --- */}
        <div className='relative aspect-[4/3] w-full overflow-hidden bg-slate-100'>
          {image ? (
            <Image
              src={image}
              alt={name || 'nghệ thuật'}
              fill
              loading='lazy'
              className='object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
              sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            />
          ) : (
            <div className='grid h-full w-full place-content-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-900'>
              <Palette className='h-16 w-16 opacity-40' />
            </div>
          )}

          {/* Overlay gradient nhẹ */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40' />

          {/* CATEGORY BADGE - Góc trên trái */}
          {categoryId?.name && (
            <div className='absolute left-3 top-3 z-10'>
              <Badge
                variant='secondary'
                className='
                  bg-white/95 text-slate-700 backdrop-blur-sm
                  border border-white/40 shadow-lg
                  px-3 py-1.5 text-xs font-semibold
                  transition-all duration-300
                  group-hover:bg-primary group-hover:text-white group-hover:scale-105
                  dark:bg-slate-800/95 dark:text-slate-200
                '
              >
                <Palette className='mr-1.5 h-3 w-3' />
                {categoryId.name}
              </Badge>
            </div>
          )}

          {/* Decorative corner accent */}
          <div className='absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
        </div>

        {/* --- CONTENT AREA --- */}
        <CardContent className='flex flex-col gap-3 p-5 flex-grow'>
          {/* Tên nghệ thuật */}
          <h3
            className='
              line-clamp-2 text-lg font-bold leading-snug text-slate-800 
              transition-colors duration-300 group-hover:text-primary
              dark:text-slate-100 dark:group-hover:text-primary
            '
            title={name}
          >
            {name}
          </h3>

          {/* Địa chỉ */}
          <div className='flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400'>
            <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-primary/70 transition-colors group-hover:text-primary' />
            <span className='line-clamp-2 font-medium leading-relaxed'>
              {location}
            </span>
          </div>
        </CardContent>

        {/* --- FOOTER / CTA --- */}
        <CardFooter className='mt-auto px-5 pb-5 pt-0'>
          <div className='flex w-full items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
            <span className='text-xs font-bold text-slate-500 uppercase tracking-wider transition-colors duration-300 group-hover:text-primary dark:text-slate-400'>
              Khám phá ngay
            </span>
            <div className='
              flex h-9 w-9 items-center justify-center rounded-full 
              bg-slate-100 text-slate-500
              transition-all duration-500 ease-out
              group-hover:bg-primary group-hover:text-white 
              group-hover:rotate-45 group-hover:scale-110
              dark:bg-slate-800 dark:text-slate-400
            '>
              <ArrowUpRight className='h-4 w-4' />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}