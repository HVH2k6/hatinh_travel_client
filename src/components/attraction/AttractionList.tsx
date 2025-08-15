import { IAttraction } from '@/interfaces/IAttraction'
import AttractionCard from './Card'


type Props = {
  data: IAttraction[]
}

export default function AttractionList({ data }: Props) {
  if (!data.length) return <p className="text-center text-muted-foreground">Không có địa điểm nào.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
      {data.map((item) => (
        <AttractionCard key={item._id} attraction={item} />
      ))}
    </div>
  )
}
