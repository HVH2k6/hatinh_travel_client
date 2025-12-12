import CardArt from '@/components/art/CardArt'
import ProductCard from '@/components/product/ProductCard'
import Heading from '@/components/text/Heading'
import { IArt } from '@/interfaces/IArt'
import { IProduct } from '@/interfaces/IProduct'


type Props = { product: IProduct[] }

export default function ListProduct({ product }: Props) {
  
  if (!product?.length) {
    return (
      <p className="text-center text-muted-foreground">
        Không có dữ liệu
      </p>
    )
  }

  return (
    <div>
      
      <Heading title='Danh sách các sản phẩm' />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {product.map((item) => (
         <ProductCard key={item._id} product={item} />
        
      ))}
    </div>
    </div>
  )
}
