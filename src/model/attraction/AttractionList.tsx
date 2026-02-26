import { IAttraction } from '@/interfaces/IAttraction';
import AttractionCard from '../../components/attraction/Card';
import Heading from '../../components/text/Heading';
import { STATUS } from '@/util/constant';

type Props = { data: IAttraction[]; isHeading?: boolean };

export default function AttractionList({ data, isHeading = true }: Props) {
  console.log("🚀 ~ AttractionList ~ data:", data)
  if (!data?.length) {
    return (
      <p className='text-center text-muted-foreground'>
        Không có địa điểm nào.
      </p>
    );
  }

  return (
    <div>
      {isHeading && (
        <Heading title='Địa điểm du lịch' url='/dia-diem-du-lich/xem-tat-ca' />
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {data
          
          .map(
            (item) =>
              item.status.toLowerCase() == STATUS.ACTIVE && (
                <AttractionCard key={item._id} attraction={item} />
              )
          )}
      </div>
    </div>
  );
}
