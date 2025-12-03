'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Waves,
  Mountain,
  History,
  Calendar,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IAttraction } from '@/interfaces/IAttraction';
import AttractionList from '@/model/attraction/AttractionList';
import ListFood from '@/model/food/ListFood';
import { IFood } from '@/interfaces/IFood';
import { IArt } from '@/interfaces/IArt';
import ListArt from '@/model/art/ListArt';

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- Milestones Data ---
const milestonesWithImages = [
  {
    year: 'Thế kỷ X - XV',
    title: 'Vùng Đất Phên Dậu & Di Sản Văn Hóa',
    description:
      'Hà Tĩnh giữ vị trí chiến lược quân sự quan trọng. Thời kỳ này hình thành nên cốt cách con người kiên trung và kho tàng văn hóa dân gian Ví, Giặm đặc sắc (Di sản văn hóa phi vật thể đại diện của nhân loại).',
    image:
      'https://res.cloudinary.com/dceqnckf1/image/upload/v1764349424/qpveehw8urt1otksmtkr.jpg',
    icon: History,
  },
  {
    year: '1968',
    title: 'Huyền Thoại Ngã Ba Đồng Lộc',
    description:
      'Biểu tượng của chủ nghĩa anh hùng cách mạng. Sự hy sinh của 10 nữ thanh niên xung phong đã biến nơi đây thành "địa chỉ đỏ" giáo dục truyền thống và điểm du lịch tâm linh trọng điểm.',
    image:
      'https://res.cloudinary.com/dceqnckf1/image/upload/v1764349449/sz0f6vhhsqhgmbgrr1ki.jpg',
    icon: MapPin,
  },
  {
    year: '2010s',
    title: 'Đánh Thức Tiềm Năng Du Lịch Biển',
    description:
      'Hà Tĩnh tập trung khai thác 137km đường bờ biển. Các khu du lịch Thiên Cầm, Xuân Thành được đầu tư hạ tầng, trở thành điểm đến nghỉ dưỡng hè hấp dẫn khu vực Bắc Trung Bộ.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
    icon: Waves,
  },
  {
    year: '2020 - Nay',
    title: 'Phát Triển Du Lịch Xanh & Đa Trải Nghiệm',
    description:
      'Chuyển mình mạnh mẽ sang du lịch sinh thái (Vườn QG Vũ Quang, Hồ Kẻ Gỗ) và nghỉ dưỡng cao cấp kết hợp sân golf, hướng tới mục tiêu điểm đến bốn mùa bền vững.',
    image:
      'https://res.cloudinary.com/dceqnckf1/image/upload/v1764349449/ep25kbhtvai4xbsugwag.jpg',
    icon: Mountain,
  },
];

type Props = { 
  data: IAttraction[];
  foods: IFood[];
  arts: IArt[];
};

export default function HaTinhLandingPage({ data, foods, arts }: Props) {
  if (!data?.length && !foods?.length && !arts?.length) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <p className='text-center text-muted-foreground text-lg'>
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <main className='bg-slate-50 font-sans text-slate-900 overflow-x-hidden'>
      {/* --- HERO SECTION --- */}
      <section className='relative w-full h-[90vh] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <img
            src='https://res.cloudinary.com/dceqnckf1/image/upload/v1764349448/ib71giz4hr3y0kcxbq5a.jpg'
            alt='Ha Tinh Landscape'
            className='w-full h-full object-cover brightness-[0.75]'
            loading='eager'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-900/70' />
        </div>

        <div className='relative z-10 container mx-auto px-6 text-center text-white mt-16'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={fadeInUp}
            className='max-w-4xl mx-auto'
          >
            <Badge className='mb-6 px-5 py-2 text-sm bg-purple-500/90 text-white backdrop-blur-md border-0 hover:bg-purple-600/90 uppercase tracking-wider font-semibold shadow-lg'>
              Chào mừng đến với Hà Tĩnh
            </Badge>
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.1] drop-shadow-2xl'>
              Về Miền <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 animate-gradient'>
                Ví, Giặm Sông La
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-12 leading-relaxed font-light drop-shadow-lg'>
              Nơi hội tụ tinh hoa văn hóa ngàn năm, những bãi biển hoang sơ và
              lịch sử hào hùng của miền Trung nắng gió.
            </p>
            <div className='flex flex-col sm:flex-row gap-5 justify-center'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full h-14 px-10 text-lg shadow-2xl shadow-purple-900/40 border-0 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl'
              >
                Bắt đầu khám phá
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='bg-white/15 backdrop-blur-md border-white/50 text-white hover:bg-white/25 hover:border-white rounded-full h-14 px-10 text-lg font-semibold transition-all duration-300 hover:-translate-y-1'
              >
                Xem video giới thiệu
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/80'>
          <Waves className='w-8 h-8' />
        </div>
      </section>

      {/* --- INTRO SECTION --- */}
      <section className='py-24 bg-white relative z-20'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className='grid md:grid-cols-2 gap-16 items-center'
          >
            <div>
              <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight'>
                Một thoáng <br className='hidden md:block' />
                <span className='text-purple-700 relative inline-block'>
                  Hà Tĩnh
                  <span className='absolute bottom-1 left-0 w-full h-3 bg-purple-200/60 -z-10 rounded-sm'></span>
                </span>
              </h2>
              <p className='text-slate-600 text-lg leading-relaxed mb-6 font-medium'>
                Nằm ở dải đất miền Trung, Hà Tĩnh không chỉ nổi tiếng là vùng
                đất địa linh nhân kiệt, quê hương của Đại thi hào Nguyễn Du,
                mà còn được thiên nhiên ban tặng vẻ đẹp đa dạng từ núi rừng hùng
                vĩ đến biển cả bao la.
              </p>
              <p className='text-slate-600 text-lg leading-relaxed mb-10'>
                Đến với Hà Tĩnh là đến với hành trình tìm về những giá trị văn
                hóa truyền thống qua làn điệu dân ca Ví, Giặm sâu lắng, đắm mình
                trong làn nước xanh biếc của biển Thiên Cầm, và tri ân những
                người anh hùng tại Ngã ba Đồng Lộc huyền thoại.
              </p>

              <div className='grid grid-cols-2 gap-6'>
                {[
                  { icon: Waves, text: '137km bờ biển' },
                  { icon: Mountain, text: 'Di sản UNESCO' },
                  { icon: History, text: '99 đỉnh Non Hồng' },
                  { icon: CheckCircle2, text: 'Ẩm thực đặc sắc' },
                ].map((item, i) => (
                  <div key={i} className='flex items-center gap-3 group'>
                    <div className='p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300'>
                      <item.icon className='text-purple-600 w-5 h-5' />
                    </div>
                    <span className='text-slate-700 font-semibold'>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='relative h-[500px]'>
              <div className='absolute top-0 right-0 w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-2xl z-10 hover:shadow-3xl transition-shadow duration-500'>
                <img
                  src='https://res.cloudinary.com/dceqnckf1/image/upload/v1764349449/vq6jjkn13vuosh5ekyap.jpg'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-700'
                  alt='Khu lưu niệm Nguyễn Du'
                  loading='lazy'
                />
              </div>
              <div className='absolute bottom-0 left-0 w-3/5 h-3/5 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 hover:shadow-2xl transition-shadow duration-500'>
                <img
                  src='https://res.cloudinary.com/dceqnckf1/image/upload/v1764349448/ib71giz4hr3y0kcxbq5a.jpg'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-700'
                  alt='Biển Thiên Cầm'
                  loading='lazy'
                />
              </div>
              <div className='absolute -top-10 -left-10 w-36 h-36 bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-pulse'></div>
              <div className='absolute bottom-10 right-10 w-36 h-36 bg-amber-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000'></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- MILESTONES SECTION --- */}
      <section className='py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden'>
        <div className='container mx-auto px-6 relative z-10'>
          <div className='text-center mb-20 max-w-3xl mx-auto'>
            <Badge
              variant='outline'
              className='mb-4 text-purple-700 border-purple-300 bg-purple-50 uppercase tracking-wider font-semibold px-4 py-1.5'
            >
              Dòng Chảy Lịch Sử
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6'>
              Hành Trình & Thành Tựu
            </h2>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Từ vùng đất phên dậu kiên cường đến điểm đến du lịch hấp dẫn, Hà
              Tĩnh đã trải qua những chặng đường phát triển đầy tự hào.
            </p>
          </div>

          <div className='relative'>
            <div className='absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-200 via-purple-400 to-transparent hidden md:block rounded-full' />

            <div className='space-y-24 md:space-y-32'>
              {milestonesWithImages.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                    className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${
                      index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className='flex-1 w-full relative group'>
                      <div className='relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] z-20 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl'>
                        <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                        <img
                          src={item.image}
                          alt={item.title}
                          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                          loading='lazy'
                        />
                      </div>

                      <div
                        className={`absolute -bottom-5 ${
                          index % 2 !== 0 ? '-left-5' : '-right-5'
                        } w-16 h-16 bg-white p-1 rounded-full shadow-lg z-30 hidden md:block group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className='w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-purple-700'>
                          <Icon className='w-6 h-6' />
                        </div>
                      </div>
                    </div>

                    <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-lg z-10 hidden md:block pulse-ring' />

                    <div className='flex-1 w-full relative z-20'>
                      <Card className='border-none shadow-none bg-transparent hover:bg-white/50 transition-colors duration-300 rounded-2xl p-6 md:p-8'>
                        <CardHeader className='p-0 mb-4'>
                          <div
                            className={`flex items-center gap-3 mb-4 ${
                              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                            }`}
                          >
                            <Calendar className='w-5 h-5 text-purple-600' />
                            <span className='text-lg font-bold text-purple-700 tracking-wide'>
                              {item.year}
                            </span>
                            <div className='flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent hidden md:block'></div>
                          </div>
                          <CardTitle
                            className={`text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight ${
                              index % 2 !== 0 ? 'md:text-right' : 'md:text-left'
                            }`}
                          >
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className='p-0'>
                          <CardDescription
                            className={`text-lg text-slate-600 leading-relaxed ${
                              index % 2 !== 0
                                ? 'md:text-right'
                                : 'md:text-left'
                            }`}
                          >
                            {item.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlN2ZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 z-0 pointer-events-none"></div>
      </section>

      {/* --- ATTRACTIONS SECTION --- */}
      {data && data.length > 0 && (
        <section className='py-24 bg-white'>
          <div className='container mx-auto px-6'>
            <div className='text-center mb-16 max-w-3xl mx-auto'>
              <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6'>
                Điểm Đến Không Thể Bỏ Lỡ
              </h2>
              <p className='text-slate-600 text-lg leading-relaxed'>
                Khám phá những danh thắng mang đậm dấu ấn thiên nhiên và con người
                Hà Tĩnh.
              </p>
            </div>
            <AttractionList data={data} />
          </div>
        </section>
      )}

      {/* --- FOOD SECTION --- */}
      {foods && foods.length > 0 && (
        <section className='py-24 bg-slate-50'>
          <div className='container mx-auto px-6'>
            <div className='text-center mb-16 max-w-3xl mx-auto'>
              <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6'>
                Đặc Sản Không Thể Bỏ Lỡ
              </h2>
              <p className='text-slate-600 text-lg leading-relaxed'>
                Khám phá những món ăn đặc sản mang đậm dấu ấn Hà Tĩnh.
              </p>
            </div>
            <ListFood food={foods} />
          </div>
        </section>
      )}

      {/* --- ART SECTION --- */}
      {arts && arts.length > 0 && (
        <section className='py-24 bg-white'>
          <div className='container mx-auto px-6'>
            <div className='text-center mb-16 max-w-3xl mx-auto'>
              <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6'>
                Nghệ Thuật & Văn Hóa
              </h2>
              <p className='text-slate-600 text-lg leading-relaxed'>
                Trải nghiệm những nét văn hóa nghệ thuật độc đáo của Hà Tĩnh.
              </p>
            </div>
            <ListArt art={arts} />
          </div>
        </section>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
          }
        }
        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}