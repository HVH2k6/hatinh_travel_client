'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type Props = {
  images: string[];
  onPick?: (src: string) => void;
  activeSrc?: string;
  title?: string;
};

export default function Gallery({ images, onPick, activeSrc, title = 'Hình ảnh' }: Props) {
  const imgs = Array.from(new Set((Array.isArray(images) ? images : []).filter(Boolean)));
  if (!imgs.length) return null;

  const useSlider = imgs.length > 3;

  const Thumb = ({ src, i }: { src: string; i: number }) => (
    <button
      type="button"
      onClick={() => onPick?.(src)}
      aria-current={activeSrc === src}
      className={[
        'relative w-full aspect-[16/10] overflow-hidden rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        activeSrc === src ? 'ring-2 ring-primary' : 'hover:opacity-90',
      ].join(' ')}
    >
      <Image src={src} alt={`thumb-${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
    </button>
  );

  if (!useSlider) {
    // ≤3 ảnh: lưới 1–2
    return (
      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <Thumb src={imgs[0]} i={0} />
          </div>
          <div className="sm:col-span-2 grid gap-3">
            {imgs.slice(1).map((src, i) => (
              <Thumb key={src + i} src={src} i={i + 1} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // >3 ảnh: slider/list ngang
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-3">
            {imgs.map((src, i) => (
              <CarouselItem key={src + i} className="pl-3 basis-[45%] sm:basis-1/3 lg:basis-1/5">
                <Thumb src={src} i={i} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
