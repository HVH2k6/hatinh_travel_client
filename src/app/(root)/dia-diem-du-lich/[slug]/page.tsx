'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Ticket, Share2, ArrowRight } from 'lucide-react';
import Gallery from '@/components/attraction/Gallery';

type Named = { name: string; codename?: string };
type Address = { provinceId?: Named; districtId?: Named; wardId?: Named; detail?: string };

// --- DEMO DATA (thay bằng dữ liệu thật khi tích hợp) ---
const data = {
  name: 'Biển Thiên Cầm',
  hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501959915551-4e8d30928317?q=80&w=1600&auto=format&fit=crop',
  ],
  type: 'Biển',
  category: 'Địa điểm tham quan',
  open: true,
  isFree: true,
  minPrice: 0,
  maxPrice: 100000,
  address: {
    provinceId: { name: 'Hà Tĩnh', codename: 'ha-tinh' },
    districtId: { name: 'Cẩm Xuyên' },
    wardId: { name: 'Thiên Cầm' },
    detail: 'Khu du lịch Thiên Cầm',
  } as Address,
  description: `
  <h3>Giới thiệu</h3>
  <p>Biển Thiên Cầm nổi tiếng với bờ cát trắng mịn, nước trong xanh và nhịp sống yên bình. Rất phù hợp nghỉ dưỡng gia đình hoặc nhóm bạn cuối tuần.</p>
  <h3>Trải nghiệm gợi ý</h3>
  <ul>
    <li>Đón bình minh/hoàng hôn, tắm biển & dạo cát.</li>
    <li>Câu mực đêm cùng ngư dân (mùa cao điểm).</li>
    <li>Check-in bãi đá, đồi cát và các điểm nhìn toàn cảnh.</li>
  </ul>
  <h3>Ẩm thực & dịch vụ</h3>
  <p>Hải sản tươi (mực, ghẹ, tôm) ở các quán ven bờ. Sáng sớm có thể ghé chợ mua đồ khô làm quà.</p>
  <h3>Giá/Phí</h3>
  <p>Không thu phí vào bãi biển. Dịch vụ gửi xe, tắm nước ngọt, ghế dù… tính theo bảng giá từng điểm.</p>
  `,
};

// --- helpers ---
const vnd = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
const priceText = (isFree: boolean, min: number, max: number) =>
  isFree ? 'Miễn phí' : `Giá từ ${vnd(min)} – ${vnd(max)} đ`;
const addrText = (a: Address) =>
  [a.detail, a.wardId?.name, a.districtId?.name, a.provinceId?.name].filter(Boolean).join(', ');

export default function AttractionDetailPage() {
  const [copied, setCopied] = React.useState(false);

  // === Hero switch: A (default) ↔ B (thumb) ===
  const [heroSrc, setHeroSrc] = React.useState<string>(data.hero);
  const galleryRef = React.useRef<HTMLDivElement>(null);

  // click ngoài khu gallery hoặc nhấn ESC -> reset về ảnh A
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = galleryRef.current;
      if (el && !el.contains(e.target as Node)) setHeroSrc(data.hero);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHeroSrc(data.hero);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: data.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch {}
  };

  return (
    <main className="pb-12">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[42vh] sm:h-[50vh] lg:h-[56vh] min-h-[260px]">
          <Image
            src={heroSrc}
            alt={data.name}
            fill
            priority
            className="object-cover transition-opacity duration-300"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />
        </div>

        {/* Overlay info */}
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="-mt-16 sm:-mt-20 w-fit rounded-2xl bg-black/50 backdrop-blur px-4 py-3 text-white shadow-lg">
            <h1 className="text-xl sm:text-2xl font-semibold">{data.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">{data.type}</Badge>
              <Badge variant="secondary" className="bg-white/80 text-gray-800">{data.category}</Badge>
              {data.open && <Badge className="bg-emerald-500 text-white">Đang mở cửa</Badge>}
            </div>
            <div className="mt-3 flex gap-2">
              <Button onClick={onShare} size="sm" variant="secondary" className="bg-white/90 text-gray-800">
                <Share2 className="mr-2 h-4 w-4" />
                {copied ? 'Đã sao chép' : 'Chia sẻ'}
              </Button>
              <Button size="sm" asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addrText(data.address))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chỉ đường <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="container max-w-6xl px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-8 space-y-6" ref={galleryRef}>
            <Gallery
              images={data.gallery}
              onPick={(src) => setHeroSrc(src)}
              activeSrc={heroSrc}
              title="Hình ảnh"
            />

            {/* Mô tả */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle>Giới thiệu & trải nghiệm</CardTitle>
              </CardHeader>
              <CardContent>
                <article
                  className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-headings:mb-3 prose-p:my-2 prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </CardContent>
            </Card>

            {/* Bản đồ */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle>Bản đồ & chỉ dẫn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl overflow-hidden border">
                  <iframe
                    title={`Bản đồ ${data.name}`}
                    className="w-full h-[320px]"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(addrText(data.address))}&output=embed`}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {addrText(data.address)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle>Thông tin nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span className="font-medium">
                    {priceText(data.isFree, data.minPrice, data.maxPrice)}
                  </span>
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">Loại hình</div>
                  <div className="font-medium">{data.type}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">Danh mục</div>
                  <div className="font-medium">{data.category}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">Địa chỉ</div>
                  <div className="font-medium leading-relaxed">{addrText(data.address)}</div>
                </div>
                <Button asChild className="w-full">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addrText(data.address))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mở Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-sky-50 to-teal-50 dark:from-sky-900/10 dark:to-teal-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mẹo nhỏ</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Đi sớm để đón bình minh và ít người.</p>
                <p>Chuẩn bị kem chống nắng, nón rộng vành.</p>
                <p>Hỏi giá trước khi dùng dịch vụ ven bờ.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
