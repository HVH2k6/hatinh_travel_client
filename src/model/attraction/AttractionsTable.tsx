'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { columns } from './columns'
import { IAttraction } from '@/interfaces/IAttraction'
import { DataAttractionTable } from './data-table'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type Props = {
  data: IAttraction[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

// Tạo danh sách trang: dạng 1 2 3 4 5 ... 31
function getPaginationItems(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const items: (number | 'ellipsis')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) items.push(i)
  } else {
    items.push(1, 2, 3, 4, 5)

    if (currentPage > 5 && currentPage < totalPages - 1) {
      items.push('ellipsis')
    }

    if (!items.includes(totalPages)) {
      items.push(totalPages)
    }
  }

  return items
}

export default function AttractionsTable({ data, pagination }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', newPage.toString())
    }

    const query = params.toString()
    router.push(`/manage/attraction${query ? `?${query}` : ''}`)
  }

  const pageItems =
    pagination.totalItems > 0
      ? getPaginationItems(pagination.currentPage, pagination.totalPages)
      : []

  const isFirstPage = pagination.currentPage === 1
  const isLastPage = pagination.currentPage === pagination.totalPages || pagination.totalPages === 0

  return (
    <div>
      <DataAttractionTable columns={columns} data={data} />

      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
        <div>
          {pagination.totalItems > 0 ? (
            <>
              Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1}–{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} trong{' '}
              {pagination.totalItems}
            </>
          ) : (
            <>Không có kết quả nào</>
          )}
        </div>

        {pagination.totalItems > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  aria-disabled={isFirstPage}
                  className={isFirstPage ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>

              {pageItems.map((page, index) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={pagination.currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  aria-disabled={isLastPage}
                  className={isLastPage ? 'pointer-events-none opacity-40' : ''}
                  
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
