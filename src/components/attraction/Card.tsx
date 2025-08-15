'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Ticket } from 'lucide-react'
import { IAttraction } from '@/interfaces/IAttraction'

type Props = {
  attraction: IAttraction
}

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

  const price = isFree
    ? 'Miễn phí'
    : `Giá từ ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()} đ`

  const location = `${address?.wardId?.name}, ${address?.districtId?.name}, ${address?.provinceId?.name}`

  return (
    <Link href={`/attractions/${slug}`} className="block group hover:shadow-lg transition-shadow h-full">
    <Card className="flex flex-col h-full overflow-hidden pt-0">
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
  
      <CardHeader className="flex-grow">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground gap-1">
          <MapPin className="w-4 h-4" />
          {location}
        </CardDescription>
      </CardHeader>
  
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <Ticket className="w-4 h-4" />
          {price}
        </div>
        <div className="text-xs italic text-green-600 bg-green-200/40 rounded-md px-2 py-1 w-max">
          {typeId?.name}
        </div>
      </CardContent>
    </Card>
  </Link>
  
  )
}
