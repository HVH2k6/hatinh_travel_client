import CardFood from '@/components/food/CardFood'
import Heading from '@/components/text/Heading'
import { IFood } from '@/interfaces/IFood'


type Props = { food: IFood[] }

export default function ListFood({ food }: Props) {
  console.log("🚀 ~ ListFood ~ food:", food)
  if (!food?.length) {
    return (
      <p className="text-center text-muted-foreground">
        Không có dữ liệu
      </p>
    )
  }

  return (
    <div>
      
      <Heading title='Danh sách đặc sản' url='/dac-san/xem-tat-ca'/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {food.map((item) => (
         <CardFood key={item._id} food={item} />
        
      ))}
    </div>
    </div>
  )
}
