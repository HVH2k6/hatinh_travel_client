'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IArt } from '@/interfaces/IArt';
import { MapPin, Play, Tag, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ExpandableDescription from '@/components/content/ContentLoad';

interface Props {
  data: IArt;
  isLoading?: boolean;
}

type MediaType = {
  type: 'video' | 'image';
  src: string;
  thumbnail?: string; // Thumbnail hiển thị ở list nhỏ
};

// --- HELPER FUNCTIONS ---

// 1. Chuyển đổi link YouTube thường -> Link Embed (để chạy trong iframe)
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` // Thêm autoplay nếu muốn tự chạy khi click
    : url;
};

// 2. Lấy link ảnh thumbnail chính thức từ YouTube (để hiển thị ở list nhỏ)
const getYouTubeThumbnailUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  // 'hqdefault.jpg' là ảnh chất lượng cao tiêu chuẩn của YouTube
  return (match && match[2].length === 11)
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : null;
}

// --- MAIN COMPONENT ---

export default function ArtDetail({ data, isLoading }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // --- 1. LOADING SKELETON ---
  if (isLoading) {
    return (
      <div className='min-h-screen bg-white p-8'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse'>
          {/* Left Skeleton */}
          <div className='lg:col-span-8 space-y-4'>
            <div className='h-[450px] bg-slate-100 rounded-3xl'></div>
            <div className='flex gap-3 overflow-hidden'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='h-24 w-24 bg-slate-100 rounded-xl flex-shrink-0'></div>
              ))}
            </div>
            <div className='h-8 w-1/3 bg-slate-100 rounded mt-8'></div>
            <div className='space-y-2'>
                <div className='h-4 w-full bg-slate-100 rounded'></div>
                <div className='h-4 w-5/6 bg-slate-100 rounded'></div>
                <div className='h-4 w-4/6 bg-slate-100 rounded'></div>
            </div>
          </div>
          {/* Right Skeleton */}
          <div className='lg:col-span-4 space-y-6'>
            <div className='h-6 w-1/3 bg-slate-100 rounded'></div>
            <div className='h-12 w-3/4 bg-slate-100 rounded'></div>
            <div className='h-20 w-full bg-slate-100 rounded-2xl'></div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. DATA PREPARATION ---
  
  // Format địa chỉ
  const address =
    [
      data.address.detail,
      data.address.wardId?.name,
      
      data.address.provinceId?.name,
    ]
      .filter(Boolean)
      .join(', ') || 'Đang cập nhật';

  // Lấy thumbnail video (nếu có)
  const videoThumbnailSrc = getYouTubeThumbnailUrl(data.video_url);

  // Tạo danh sách Media hỗn hợp (Video + Ảnh)
  const mediaList: MediaType[] = [
    // Nếu có video, đưa lên đầu tiên
    ...(data.video_url 
        ? [{ 
            type: 'video', 
            src: getYouTubeEmbedUrl(data.video_url), // Link embed cho iframe
            // Dùng thumb YouTube, nếu lỗi thì dùng ảnh chính của bài viết
            thumbnail: videoThumbnailSrc || data.image 
          }] as MediaType[] 
        : []
    ),
    // Ảnh chính
    { type: 'image', src: data.image, thumbnail: data.image },
    // Danh sách ảnh phụ
    ...data.list_image.map((img) => ({ type: 'image', src: img, thumbnail: img } as MediaType)),
  ];

  const activeMedia = mediaList[activeIndex];

  return (
    <div className='min-h-screen bg-white text-slate-900 pb-20 pt-8'>
      <div className='container max-w-7xl mx-auto px-4'>
        
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          
          {/* --- LEFT COLUMN: GALLERY & DESCRIPTION (Chiếm 8 phần) --- */}
          <div className='lg:col-span-8 space-y-6'>
            
            {/* A. Màn hình hiển thị chính (Main Display) */}
            <div className='relative aspect-video w-full overflow-hidden rounded-3xl bg-black border border-slate-100 shadow-sm'>
              {activeMedia.type === 'video' ? (
                <iframe
                  src={activeMedia.src}
                  className='w-full h-full'
                  title={data.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={activeMedia.src}
                  alt={data.name}
                  fill
                  className='object-cover transition-transform duration-700 hover:scale-105'
                  priority
                />
              )}
            </div>

            {/* B. Danh sách Thumbnails (Scroll ngang) */}
            {mediaList.length > 1 && (
              <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-1'>
                {mediaList.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                      activeIndex === index
                        ? 'border-slate-900 opacity-100 scale-105 ring-2 ring-slate-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Nếu là Video: Hiển thị icon Play đè lên thumbnail */}
                    {media.type === 'video' && (
                        <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors'>
                             <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm shadow-md">
                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                             </div>
                        </div>
                    )}
                    
                    {/* Luôn hiển thị ảnh (thumbnail) */}
                    <Image
                      src={media.thumbnail || media.src}
                      alt={`thumb-${index}`}
                      fill
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            )}

            <Separator className="my-8" />

            {/* C. Phần mô tả chi tiết */}
            <div className='prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl'>
              <h3 className='text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2'>
                Giới thiệu chi tiết
              </h3>
              <div className="bg-slate-50/50 p-6 rounded-3xl">
                 <ExpandableDescription content={data.description} maxHeight={300} />
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: STICKY INFO (Chiếm 4 phần) --- */}
          <aside className='lg:col-span-4'>
            <div className='sticky top-24 space-y-8'>
              
              {/* Header Info */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                    <Badge variant="secondary" className='bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 text-xs uppercase tracking-wide font-semibold border border-slate-200'>
                        {data.categoryId.name}
                    </Badge>
                </div>
                
                <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight'>
                  {data.name}
                </h1>

                <div className='flex items-start gap-3 text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm'>
                    <MapPin className='w-5 h-5 flex-shrink-0 mt-0.5 text-red-500' />
                    <p className='text-sm leading-relaxed font-medium'>{address}</p>
                </div>
              </div>

              <Separator />

              {/* Extra Info Box */}
            

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}