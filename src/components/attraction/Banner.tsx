import Image from 'next/image'

export default function BannerAttraction() {
  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden">
      
      <Image
        src="https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0"
        alt="Banner"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-6 md:p-12 text-white">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow">
          Khám phá vẻ đẹp thiên nhiên hùng vĩ
        </h1>
        <p className="text-sm md:text-lg max-w-xl drop-shadow">
          Địa điểm du lịch nổi bật với phong cảnh tuyệt đẹp, lịch sử lâu đời và những trải nghiệm không thể quên.
        </p>
      </div>
    </div>
  )
}