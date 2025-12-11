'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Ticket,
  Share2,
  ArrowRight,
  Clock,
  Users,
  Star,
  Camera,
  Calendar,
  Phone,
  Globe,
  Heart,
  Navigation,
  Sun,
  Mountain,
} from 'lucide-react';
import Gallery from '@/components/attraction/Gallery';
import { IAttraction } from '@/interfaces/IAttraction';
import PriceDisplay from '@/helper/covertMoney';
import ReviewSection from '@/components/review/ReviewSection';

type Named = { name?: string };

// Loading Skeleton Component
const AttractionDetailSkeleton = () => {
  return (
    <main className='pb-12'>
      {/* Hero Skeleton */}
      <section className='relative'>
        <div className='relative h-[42vh] sm:h-[50vh] lg:h-[60vh] min-h-[320px]'>
          <Skeleton className='w-full h-full' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent' />
        </div>

        <div className='container max-w-7xl px-4 md:px-6'>
          <div className='-mt-20 sm:-mt-24 w-fit rounded-3xl bg-black/60 backdrop-blur-xl px-6 py-4 shadow-2xl border border-white/10'>
            <Skeleton className='h-8 w-80 mb-3 bg-white/20' />
            <div className='flex flex-wrap items-center gap-2 mb-4'>
              <Skeleton className='h-6 w-20 bg-white/20' />
              <Skeleton className='h-6 w-24 bg-white/20' />
            </div>
            <div className='flex gap-3'>
              <Skeleton className='h-9 w-24 bg-white/20' />
              <Skeleton className='h-9 w-28 bg-white/20' />
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <div className='container max-w-7xl px-4 md:px-6 mt-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          {/* Main Content */}
          <div className='lg:col-span-8 space-y-8'>
            {/* Gallery Skeleton */}
            <Card className='rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-gray-50'>
              <CardHeader className='pb-4'>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className='aspect-video rounded-xl' />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description Skeleton */}
            <Card className='rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-blue-50'>
              <CardHeader className='pb-4'>
                <Skeleton className='h-7 w-48' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
                <Skeleton className='h-4 w-4/5' />
                <Skeleton className='h-6 w-40 mt-6' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <div className='grid grid-cols-2 gap-4 mt-6'>
                  <Skeleton className='h-20 rounded-xl' />
                  <Skeleton className='h-20 rounded-xl' />
                </div>
              </CardContent>
            </Card>

            {/* Map Skeleton */}
            <Card className='rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-green-50'>
              <CardHeader className='pb-4'>
                <Skeleton className='h-6 w-36' />
              </CardHeader>
              <CardContent>
                <Skeleton className='w-full h-[320px] rounded-2xl' />
                <Skeleton className='h-4 w-64 mt-4' />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <aside className='lg:col-span-4 space-y-6'>
            <Card className='rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 sticky top-6'>
              <CardHeader className='pb-4'>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <Skeleton className='h-8 w-40' />
                  <Separator />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-5 w-full' />
                    </div>
                  ))}
                </div>
                <Skeleton className='h-12 w-full rounded-xl' />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

// Chuẩn hoá list_image (string JSON | array) + ưu tiên ảnh hero
function toGallery(list_image: unknown, image: string) {
  let arr: string[] = [];
  if (Array.isArray(list_image)) arr = list_image as string[];
  else if (typeof list_image === 'string' && list_image.trim()) {
    try {
      arr = JSON.parse(list_image);
    } catch {
      arr = [];
    }
  }
  return Array.from(new Set([image, ...arr].filter(Boolean)));
}

// Tạo chuỗi địa chỉ hiển thị/tìm kiếm
function buildAddressString(a: IAttraction['address']): string {
  return [
    a?.detail,
    (a?.wardId as Named)?.name,
    
    (a?.provinceId as Named)?.name,
  ]
    .filter(Boolean)
    .join(', ');
}

interface AttractionDetailProps {
  attraction: IAttraction;
  isLoading?: boolean;
}

export default function AttractionDetail({
  attraction,
  isLoading = false,
}: AttractionDetailProps) {
  // Show skeleton loading

  const gallery = toGallery(attraction.list_image as any, attraction.image);
  const addressStr = buildAddressString(attraction.address);
  const addressStrMap = `${attraction.name}`;

  const nf = React.useMemo(() => new Intl.NumberFormat('vi-VN'), []);
  // Xử lý giá tiền (Min/Max)
  const minPrice = Number(attraction.minPrice || 0);
  const maxPrice = Number(attraction.maxPrice || 0);

  // === Hero switch: click thumb => đổi ảnh; click ngoài/ESC => về ảnh đầu ===
  const [heroSrc, setHeroSrc] = React.useState<string>(
    gallery[0] || attraction.image
  );
  const [isFavorite, setIsFavorite] = React.useState(false);
  const galleryRef = React.useRef<HTMLDivElement>(null);

  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  // ESC để đóng lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  // Khóa scroll khi mở lightbox
  React.useEffect(() => {
    if (lightboxOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [lightboxOpen]);

  const [copied, setCopied] = React.useState(false);
  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: attraction.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch {}
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  if (isLoading || !attraction) {
    return <AttractionDetailSkeleton />;
  }

  return (
    <main className='pb-16'>
      {/* ENHANCED HERO SECTION */}
      <section className='relative overflow-hidden'>
        <div className='relative h-[42vh] sm:h-[50vh] lg:h-[65vh] min-h-[360px]'>
          <Image
            src={heroSrc}
            alt={attraction.name}
            fill
            priority
            className='object-cover transition-all duration-700 hover:scale-105 cursor-zoom-in'
            sizes='100vw'
            onClick={openLightbox}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />

          {/* Floating Action Buttons */}
          <div className='absolute top-6 right-6 flex gap-2'>
            <Button
              size='sm'
              variant='secondary'
              className='bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg'
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>
            <Button
              size='sm'
              variant='secondary'
              className='bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg'
              onClick={openLightbox}
            >
              <Camera className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='container max-w-7xl px-4 md:px-6'>
          <div className='-mt-24 sm:-mt-28 max-w-2xl'>
            <div className='rounded-3xl bg-black/60 backdrop-blur-xl px-6 py-5 text-white shadow-2xl border border-white/10'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight'>
                    {attraction.name}
                  </h1>
                  <div className='flex flex-wrap items-center gap-2 mb-4'>
                    {attraction.typeId && (
                      <Badge className='bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1'>
                        <Mountain className='w-3 h-3 mr-1' />
                        {attraction.typeId.name}
                      </Badge>
                    )}
                    {attraction.categoryId && (
                      <Badge className='bg-gradient-to-r from-green-500 to-teal-600 text-white border-0 px-3 py-1'>
                        <Sun className='w-3 h-3 mr-1' />
                        {attraction.categoryId.name}
                      </Badge>
                    )}
                   
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Button
                  onClick={onShare}
                  size='sm'
                  variant='secondary'
                  className='bg-white/90 hover:bg-white text-gray-800 transition-all duration-300 transform hover:scale-105'
                >
                  <Share2 className='mr-2 h-4 w-4' />
                  {copied ? 'Đã sao chép!' : 'Chia sẻ'}
                </Button>
                <Button
                  size='sm'
                  className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105'
                  asChild
                >
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      addressStrMap
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Navigation className='mr-2 h-4 w-4' />
                    Chỉ đường
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED CONTENT SECTION */}
      <div className='container max-w-7xl px-4 md:px-6 mt-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          {/* MAIN CONTENT */}
          <div className='lg:col-span-8 space-y-8' ref={galleryRef}>
            {/* Enhanced Gallery */}
            <Card className='rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300'>
              <CardHeader className='pb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl'>
                <CardTitle className='flex items-center text-xl'>
                  <Camera className='mr-3 h-5 w-5 text-blue-600' />
                  Thư viện ảnh
                  <Badge className='ml-auto bg-blue-100 text-blue-800'>
                    {gallery.length} ảnh
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <Gallery
                  images={gallery}
                  onPick={setHeroSrc}
                  activeSrc={heroSrc}
                  title='Hình ảnh'
                />
              </CardContent>
            </Card>

            {/* Enhanced Description */}
            <Card className='rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300'>
              <CardHeader className='pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl'>
                <CardTitle className='flex items-center text-xl'>
                  <Globe className='mr-3 h-5 w-5 text-indigo-600' />
                  Khám phá & trải nghiệm
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <article
                  className='prose prose-lg max-w-none dark:prose-invert 
                             prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4
                             prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                             prose-li:text-gray-700 prose-li:mb-2
                             prose-strong:text-gray-900 prose-strong:font-semibold
                             prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline'
                  dangerouslySetInnerHTML={{
                    __html: attraction.description || '',
                  }}
                />
              </CardContent>
            </Card>

            {/* Enhanced Map */}
            <Card className='rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300'>
              <CardHeader className='pb-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-3xl'>
                <CardTitle className='flex items-center text-xl'>
                  <MapPin className='mr-3 h-5 w-5 text-green-600' />
                  Vị trí & chỉ đường
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-4'>
                <div className='rounded-2xl overflow-hidden border-2 border-green-100 shadow-lg'>
                  <iframe
                    title={`Bản đồ ${attraction.name}`}
                    className='w-full h-[350px]'
                    loading='lazy'
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      addressStrMap
                    )}&output=embed`}
                  />
                </div>
                <div className='bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-2xl'>
                  <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-green-800 mb-1'>
                        Địa chỉ chi tiết
                      </p>
                      <p className='text-green-700 text-sm leading-relaxed'>
                        {addressStr}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ENHANCED SIDEBAR */}
          <aside className='lg:col-span-4 space-y-6'>
            <Card className='rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-purple-50 sticky top-6 hover:shadow-2xl transition-all duration-300'>
              <CardHeader className='pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl'>
                <CardTitle className='flex items-center text-xl'>
                  <Ticket className='mr-3 h-5 w-5 text-purple-600' />
                  Thông tin du lịch
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                {/* Price Section */}
                <div className='bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-2xl'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-blue-500 p-2 rounded-xl'>
                      <Ticket className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <p className='text-sm text-blue-600 font-medium'>
                        Giá vé tham quan
                      </p>
                      {attraction.isFree ? (
                        <span className='text-2xl font-bold text-emerald-600'>
                          Miễn phí
                        </span>
                      ) : (
                        <div className='text-2xl font-bold text-red-600 flex items-center justify-center flex-wrap gap-2'>
                          {minPrice > 0 && minPrice < maxPrice ? (
                            <>
                              <PriceDisplay value={minPrice} />
                              <span className='text-gray-400'>-</span>
                              <PriceDisplay value={maxPrice} />
                            </>
                          ) : (
                            <PriceDisplay value={maxPrice || minPrice} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className='my-6' />

                {/* Quick Info Grid */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center p-3 bg-gray-50 rounded-xl'>
                    <span className='text-sm text-gray-600 flex items-center'>
                      <Mountain className='h-4 w-4 mr-2' />
                      Loại hình
                    </span>
                    <span className='font-semibold text-gray-800'>
                      {attraction.typeId.name || '—'}
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-gray-50 rounded-xl'>
                    <span className='text-sm text-gray-600 flex items-center'>
                      <Sun className='h-4 w-4 mr-2' />
                      Danh mục
                    </span>
                    <span className='font-semibold text-gray-800'>
                      {attraction.categoryId.name || '—'}
                    </span>
                  </div>


                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='text-sm text-gray-600 mb-2 flex items-center'>
                      <MapPin className='h-4 w-4 mr-2' />
                      Địa chỉ
                    </div>
                    <div className='font-medium text-gray-800 leading-relaxed text-sm'>
                      {addressStr}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='space-y-3 pt-4'>
                  <Button
                    className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg'
                    asChild
                  >
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        addressStrMap
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Navigation className='mr-2 h-5 w-5' />
                      Mở Google Maps
                    </a>
                  </Button>

                  <Button
                    variant='outline'
                    className='w-full border-2 border-gray-200 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300'
                    onClick={onShare}
                  >
                    <Share2 className='mr-2 h-4 w-4' />
                    Chia sẻ địa điểm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        <div className='container max-w-7xl px-4 md:px-6 mt-12'>
          <ReviewSection 
             targetId={attraction._id} 
             targetType="Attraction" 
          />
       </div>
      </div>
    </main>
  );
}
