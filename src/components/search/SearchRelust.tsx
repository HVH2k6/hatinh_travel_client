import ListArt from "@/model/art/ListArt";
import AttractionList from "@/model/attraction/AttractionList";
import ListFood from "@/model/food/ListFood";
import ListShop from "../shop/Card";
import ListProduct from "@/model/product/ListProduct";

interface SearchData {
  attractions: any[];
  food: any[];
  art: any[];
  products: any[];
  shops: any[];
  total: number;
}

async function fetchSearchResults(query: string): Promise<SearchData | null> {
  if (!query || query.trim().length < 2) {
    return null;
  }
try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Log để debug
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.get('content-type'));

    if (!response.ok) {
      const text = await response.text();
      console.error('Response error:', text);
      throw new Error(`Search failed: ${response.status}`);
    }

    // Kiểm tra content-type trước khi parse JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but got:', text.substring(0, 200));
      throw new Error('Server returned non-JSON response');
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

export default async function SearchResults({ query }: { query: string }) {
  if (!query || query.trim().length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Vui lòng nhập từ khóa tìm kiếm (tối thiểu 2 ký tự)
        </p>
      </div>
    );
  }

  const data = await fetchSearchResults(query);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">
          Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  if (data.total === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Không tìm thấy kết quả nào cho {query}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Thử tìm kiếm với từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hiển thị tổng kết quả */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Tìm thấy <span className="font-semibold">{data.total}</span> kết quả
        </p>
      </div>

      {/* Điểm đến */}
      {data.attractions?.length > 0 && (
        <section>
          <AttractionList data={data.attractions} isHeading={false} />
        </section>
      )}

      {/* Đặc sản */}
      {data.food?.length > 0 && (
        <section>
          <ListFood food={data.food} isHeading={false}/>
        </section>
      )}

      {/* Nghệ thuật */}
      {data.art?.length > 0 && (
        <section>
          <ListArt art={data.art} isHeading={false}/>
        </section>
      )}

      {/* Sản phẩm */}
      {data.products?.length > 0 && (
        <section>
          <ListProduct product={data.products} />
        </section>
      )}

      {/* Chợ */}
      {data.shops?.length > 0 && (
        <section>
          <ListShop data={data.shops} />
        </section>
      )}
    </div>
  );
}