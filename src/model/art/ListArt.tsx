import CardArt from '@/components/art/CardArt'
import Heading from '@/components/text/Heading'
import { IArt } from '@/interfaces/IArt'


type Props = { art: IArt[],isHeading?: boolean }

export default function ListArt({ art,isHeading= true }: Props) {
  console.log(">>>>>>:",art);
  
  if (!art?.length) {
    return (
      <p className="text-center text-muted-foreground">
        Không có dữ liệu
      </p>
    )
  }

  return (
    <div>
      
      {isHeading && <Heading title='Danh sách các văn hóa và nghệ thuật' url='/van-hoa-nghe-thuat/xem-tat-ca'/>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {art.map((item) => (
         <CardArt key={item._id} art={item} />
        
      ))}
    </div>
    </div>
  )
}
