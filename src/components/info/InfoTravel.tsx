'use client';

import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Waves,
  Mountain,
  History,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

// --- UI Components (Giả định đã cài đặt Shadcn UI) ---
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


// --- DỮ LIỆU ---

// Cập nhật Milestones thêm hình ảnh
const milestonesWithImages = [
  {
    year: 'Thế kỷ X - XV',
    title: 'Vùng Đất Phên Dậu & Di Sản Văn Hóa',
    description:
      'Hà Tĩnh giữ vị trí chiến lược quân sự quan trọng. Thời kỳ này hình thành nên cốt cách con người kiên trung và kho tàng văn hóa dân gian Ví, Giặm đặc sắc (Di sản văn hóa phi vật thể đại diện của nhân loại).',
    image:
      'https://res.cloudinary.com/dceqnckf1/image/upload/v1764349424/qpveehw8urt1otksmtkr.jpg', // Ảnh minh họa: Văn hóa/Cổ kính
    icon: <History className='w-5 h-5' />,
  },
  {
    year: '1968',
    title: 'Huyền Thoại Ngã Ba Đồng Lộc',
    description:
      "Biểu tượng của chủ nghĩa anh hùng cách mạng. Sự hy sinh của 10 nữ thanh niên xung phong đã biến nơi đây thành 'địa chỉ đỏ' giáo dục truyền thống và điểm du lịch tâm linh trọng điểm.",
    image:
      'https://res.cloudinary.com/dceqnckf1/image/upload/v1764349449/sz0f6vhhsqhgmbgrr1ki.jpg', // Ảnh minh họa: Tượng đài Đồng Lộc (Thay bằng link ảnh thật nếu có)
    icon: <MapPin className='w-5 h-5' />,
  },
  {
    year: '2010s',
    title: 'Đánh Thức Tiềm Năng Du Lịch Biển',
    description:
      'Hà Tĩnh tập trung khai thác 137km đường bờ biển. Các khu du lịch Thiên Cầm, Xuân Thành được đầu tư hạ tầng, trở thành điểm đến nghỉ dưỡng hè hấp dẫn khu vực Bắc Trung Bộ.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop', // Ảnh minh họa: Biển
    icon: <Waves className='w-5 h-5' />,
  },
  {
    year: '2020 - Nay',
    title: 'Phát Triển Du Lịch Xanh & Đa Trải Nghiệm',
    description:
      'Chuyển mình mạnh mẽ sang du lịch sinh thái (Vườn QG Vũ Quang, Hồ Kẻ Gỗ) và nghỉ dưỡng cao cấp kết hợp sân golf, hướng tới mục tiêu điểm đến bốn mùa bền vững.',
    image:
      'https://res.cloudinary.com/dceqnckf1/image/upload/v1764349449/ep25kbhtvai4xbsugwag.jpg', // Ảnh minh họa: Sân golf/Resort sinh thái
    icon: <Mountain className='w-5 h-5' />,
  },
];

const destinations = [
  {
    id: 1,
    name: 'Biển Thiên Cầm',
    category: 'Nghỉ dưỡng biển',
    image:
      'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/bien-thien-cam-ha-tinh-vntrip-3.jpg',
    desc: 'Bãi biển đẹp nhất Hà Tĩnh với cát trắng mịn, nước trong xanh và sóng êm đềm như tiếng đàn.',
  },
  {
    id: 2,
    name: 'Khu di tích Nguyễn Du',
    category: 'Văn hóa - Lịch sử',
    image:
      'https://hatinh.gov.vn/uploads/images/2022/09/23/khu-luu-niem-nguyen-du-1663924896.jpg',
    desc: 'Quê hương Đại thi hào dân tộc, nơi lưu giữ những giá trị văn hóa Truyện Kiều bất hủ.',
  },
  {
    id: 3,
    name: 'Hồ Kẻ Gỗ',
    category: 'Sinh thái',
    image: 'https://static.vinwonders.com/production/ho-ke-go-ha-tinh-2.jpg',
    desc: 'Hồ nước ngọt nhân tạo khổng lồ giữa rừng già, cảnh sắc thơ mộng, lý tưởng cho du thuyền và cắm trại.',
  },
  {
    id: 4,
    name: 'Chùa Hương Tích',
    category: 'Tâm linh',
    image:
      'https://ik.imagekit.io/tvlk/blog/2023/03/chua-huong-tich-ha-tinh-2.jpg',
    desc: "Được mệnh danh là 'Hoan Châu đệ nhất danh lam', tọa lạc trên đỉnh núi Hồng Lĩnh hùng vĩ.",
  },
];

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
type Props = { data: IAttraction[] ,foods: IFood[]};

export default function HaTinhLandingPage({ data, foods }: Props) {
  console.log(">>>> food", foods);
  if (!data?.length) {
    return (
      <p className='text-center text-muted-foreground'>
        Không có địa điểm nào.
      </p>
    );
  }
  return (
    <main className='bg-slate-50 font-sans text-slate-900 overflow-x-hidden'>
      <Head>
        <title>Du Lịch Hà Tĩnh - Hành Trình Di Sản & Thiên Nhiên</title>
        <meta
          name='description'
          content='Khám phá Hà Tĩnh - Vùng đất của văn hóa Ví Giặm, biển Thiên Cầm và núi Hồng Lĩnh.'
        />
      </Head>

      {/* --- SECTION 1: HERO (Ấn tượng ban đầu) --- */}
      {/* Sử dụng kỹ thuật breakout container để tràn viền */}
      <section className='relative w-screen ml-[calc(-50vw+50%)] h-[90vh] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <img
            src='https://res.cloudinary.com/dceqnckf1/image/upload/v1764349448/ib71giz4hr3y0kcxbq5a.jpg' // Ảnh núi non hùng vĩ
            alt='Ha Tinh Landscape'
            className='w-full h-full object-cover brightness-[0.8]'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-slate-900/60' />
        </div>

        <div className='relative z-10 container mx-auto px-6 text-center text-white mt-16'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={fadeInUp}
            className='max-w-4xl mx-auto'
          >
            <Badge className='mb-6 px-4 py-1.5 text-sm bg-purple-500/80 text-white backdrop-blur-md border-0 hover:bg-purple-600/80 uppercase tracking-wider font-medium'>
              Chào mừng đến với Hà Tĩnh
            </Badge>
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold  mb-8 leading-tight drop-shadow-2xl'>
              Về Miền <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200'>
                Ví, Giặm Sông La
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-12 leading-relaxed font-light drop-shadow-md'>
              Nơi hội tụ tinh hoa văn hóa ngàn năm, những bãi biển hoang sơ và
              lịch sử hào hùng của miền Trung nắng gió.
            </p>
            <div className='flex flex-col sm:flex-row gap-5 justify-center'>
              <Button
                size='lg'
                className='bg-purple-600 hover:bg-purple-700 text-white rounded-full h-14 px-10 text-lg shadow-xl shadow-purple-900/30 border-0 font-semibold transition-transform hover:-translate-y-1'
              >
                Bắt đầu khám phá
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 hover:border-white rounded-full h-14 px-10 text-lg font-semibold transition-transform hover:-translate-y-1'
              >
                Xem video giới thiệu
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/70'>
          <Waves className='w-8 h-8' />
        </div>
      </section>

      {/* --- SECTION 2: INTRO & SUMMARY (Giới thiệu tóm tắt) --- */}
      <section className='py-24 bg-white relative z-20'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
            className='grid md:grid-cols-2 gap-16 items-center'
          >
            {/* Left Content */}
            <div>
              <h2 className='text-4xl md:text-5xl  font-bold text-slate-900 mb-8 leading-tight'>
                Một thoáng <br className='hidden md:block' />
                <span className='text-purple-700 relative inline-block'>
                  Hà Tĩnh
                  <span className='absolute bottom-1 left-0 w-full h-3 bg-purple-200/50 -z-10'></span>
                </span>
              </h2>
              <p className='text-slate-600 text-lg leading-relaxed mb-6 text-justify font-medium'>
                Nằm ở dải đất miền Trung, Hà Tĩnh không chỉ nổi tiếng là vùng
                đất `địa linh nhân kiệt`, quê hương của Đại thi hào Nguyễn Du,
                mà còn được thiên nhiên ban tặng vẻ đẹp đa dạng từ núi rừng hùng
                vĩ đến biển cả bao la.
              </p>
              <p className='text-slate-600 text-lg leading-relaxed mb-10 text-justify'>
                Đến với Hà Tĩnh là đến với hành trình tìm về những giá trị văn
                hóa truyền thống qua làn điệu dân ca Ví, Giặm sâu lắng, đắm mình
                trong làn nước xanh biếc của biển Thiên Cầm, và tri ân những
                người anh hùng tại Ngã ba Đồng Lộc huyền thoại.
              </p>

              {/* Quick Stats - Best Practice cho landing page */}
              <div className='grid grid-cols-2 gap-6'>
                <div className='flex items-center gap-3'>
                  <CheckCircle2 className='text-purple-600 w-6 h-6' />
                  <span className='text-slate-700 font-semibold'>
                    137km bờ biển
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle2 className='text-purple-600 w-6 h-6' />
                  <span className='text-slate-700 font-semibold'>
                    Di sản UNESCO
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle2 className='text-purple-600 w-6 h-6' />
                  <span className='text-slate-700 font-semibold'>
                    99 đỉnh Non Hồng
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle2 className='text-purple-600 w-6 h-6' />
                  <span className='text-slate-700 font-semibold'>
                    Ẩm thực đặc sắc
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image Composition */}
            <div className='relative h-[500px]'>
              <div className='absolute top-0 right-0 w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-2xl z-10'>
                <img
                  src='https://res.cloudinary.com/dceqnckf1/image/upload/v1764349449/vq6jjkn13vuosh5ekyap.jpg'
                  className='w-full h-full object-cover'
                  alt='Khu lưu niệm Nguyễn Du'
                />
              </div>
              <div className='absolute bottom-0 left-0 w-3/5 h-3/5 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20'>
                <img
                  src='https://res.cloudinary.com/dceqnckf1/image/upload/v1764349448/ib71giz4hr3y0kcxbq5a.jpg'
                  className='w-full h-full object-cover'
                  alt='Biển Thiên Cầm'
                />
              </div>
              {/* Decorative Element */}
              <div className='absolute -top-10 -left-10 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 z-0'></div>
              <div className='absolute bottom-10 right-10 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 z-0'></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: MILESTONES (Hành trình phát triển - ZIGZAG LAYOUT) --- */}
      <section className='py-24 bg-slate-50 relative overflow-hidden'>
        <div className='container mx-auto px-6 relative z-10'>
          <div className='text-center mb-20 max-w-3xl mx-auto'>
            <Badge
              variant='outline'
              className='mb-4 text-purple-700 border-purple-300 bg-purple-50 uppercase tracking-wider'
            >
              Dòng Chảy Lịch Sử
            </Badge>
            <h2 className='text-4xl md:text-5xl  font-bold text-slate-900 mb-6'>
              Hành Trình & Thành Tựu
            </h2>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Từ vùng đất phên dậu kiên cường đến điểm đến du lịch hấp dẫn, Hà
              Tĩnh đã trải qua những chặng đường phát triển đầy tự hào.
            </p>
          </div>

          <div className='relative'>
            {/* Đường kẻ dọc trung tâm */}
            <div className='absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-200 via-purple-400 to-slate-200 hidden md:block rounded-full' />

            <div className='space-y-24 md:space-y-32'>
              {milestonesWithImages.map((item, index) => (
                <motion.div
                  key={index}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: '-100px' }}
                  variants={fadeInUp}
                  className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${
                    index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Side */}
                  <div className='flex-1 w-full relative group'>
                    <div className='relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] z-20 transition-transform duration-500 group-hover:-translate-y-2'>
                      {/* Overlay gradient để text dễ đọc nếu cần */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                      <img
                        src={item.image}
                        alt={item.title}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                      />
                    </div>

                    {/* Decorative Icon on Image Corner */}
                    <div
                      className={`absolute -bottom-5 ${
                        index % 2 !== 0 ? '-left-5' : '-right-5'
                      } w-16 h-16 bg-white p-1 rounded-full shadow-lg z-30 hidden md:block`}
                    >
                      <div className='w-full h-full bg-purple-100 rounded-full flex items-center justify-center text-purple-700'>
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Timeline Node (Center Dot) */}
                  <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md z-10 hidden md:block' />

                  {/* Content Side */}
                  <div className='flex-1 w-full relative z-20'>
                    <Card className='border-none shadow-none bg-transparent'>
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
                          <div className='flex-1 h-px bg-purple-200 hidden md:block'></div>
                        </div>
                        <CardTitle
                          className={`text-2xl md:text-3xl font-bold text-slate-800 mb-4 leading-tight ${
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
                              ? 'md:text-right md:pl-10'
                              : 'md:text-left md:pr-10'
                          }`}
                        >
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 right-0 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0 pointer-events-none"></div>
      </section>

      {/* --- SECTION 4: FEATURED DESTINATIONS (Điểm đến nổi bật) --- */}
      <section className='pt-24  bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16 max-w-3xl mx-auto'>
            <h2 className='text-4xl md:text-5xl  font-bold text-slate-900 mb-6'>
              Điểm Đến Không Thể Bỏ Lỡ
            </h2>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Khám phá những danh thắng mang đậm dấu ấn thiên nhiên và con người
              Hà Tĩnh.
            </p>
          </div>
          <AttractionList data={data || []} />

        
        </div>
      </section>
       <section className='pt-24 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16 max-w-3xl mx-auto'>
            <h2 className='text-4xl md:text-5xl  font-bold text-slate-900 mb-6'>
              Đặc sản Không Thể Bỏ Lỡ
            </h2>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Khám phá những món ăn đặc sản mang đậm dấu ấn 
              Hà Tĩnh.
            </p>
          </div>
          <ListFood food={foods || []} />

        
        </div>
      </section>
    </main>
  );
}
