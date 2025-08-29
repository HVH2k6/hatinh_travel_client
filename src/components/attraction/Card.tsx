'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import { IAttraction } from '@/interfaces/IAttraction'

type Props = { attraction: IAttraction }

export default function AttractionCard({ attraction }: Props) {
  const {
    slug,
    name,
    image,
    address,
    isFree,
    minPrice,
    maxPrice,
    typeId,
  } = attraction

  // Chốt locale để không lệch SSR/CSR
  const nf = useMemo(() => new Intl.NumberFormat('vi-VN'), [])

  // Chuẩn hoá số (nếu API trả string)
  const min = typeof minPrice === 'number' ? minPrice : Number(minPrice ?? 0)
  const max = typeof maxPrice === 'number' ? maxPrice : Number(maxPrice ?? 0)

  const priceText = isFree ? 'Miễn phí' : `Giá từ ${nf.format(min)} – ${nf.format(max)} đ`
  const location =
    [address?.wardId?.name, address?.districtId?.name, address?.provinceId?.name]
      .filter(Boolean)
      .join(', ') || 'Đang cập nhật'

  const href = `/dia-diem-du-lich/${slug}`

  return (
    <Link href={href} prefetch className="group block h-full focus:outline-none">
      <Card
        className="
          relative flex h-full flex-col overflow-hidden rounded-2xl border
          transition-all duration-300
          hover:shadow-lg hover:border-transparent
          focus-visible:ring-2 focus-visible:ring-primary/60
        "
        aria-label={name}
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3]">
          {image ? (
            <Image
              src={image}
              alt={name || 'Ảnh địa điểm'}
              fill
              loading="lazy"
              sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full w-full place-content-center bg-gradient-to-br from-sky-100 to-teal-100 text-sky-700">
              🏖️
            </div>
          )}

          {/* Gradient overlay để chữ nổi hơn */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* TYPE pill (góc dưới trái) */}
          {typeId?.name ? (
            <Badge
              className="
                absolute left-3 bottom-3 z-[1]
                bg-white/90 text-gray-800 shadow
                backdrop-blur-sm
              "
              variant="secondary"
            >
              {typeId.name}
            </Badge>
          ) : null}

          {/* PRICE pill (góc trên phải) */}
          <Badge
            className="
              absolute right-3 top-3 z-[1]
              bg-emerald-500 text-white shadow
              group-hover:translate-y-[-1px] transition-transform
            "
          >
            {priceText}
          </Badge>
        </div>

        {/* CONTENT */}
        <CardHeader className="flex-grow space-y-2">
          <CardTitle className="line-clamp-2 text-lg sm:text-xl">
            {name}
          </CardTitle>
          <CardDescription className="flex items-start gap-1.5 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-5">
          {/* CTA nhẹ nhàng ở chân thẻ */}
          <div
            className="
              inline-flex items-center gap-1 rounded-full px-3 py-1
              text-xs font-medium
              bg-sky-50 text-sky-700
              transition-colors group-hover:bg-sky-100
              dark:bg-sky-900/20 dark:text-sky-300 dark:group-hover:bg-sky-900/30
            "
          >
            Xem chi tiết
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
