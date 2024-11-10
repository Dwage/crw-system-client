import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const TablePagination = ({
  totalItems,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  dataLength,
}) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Показано {dataLength} из {totalItems} записей
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(Math.min(5, Math.ceil(totalItems / pageSize)))].map(
            (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          {Math.ceil(totalItems / pageSize) > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(Math.ceil(totalItems / pageSize), prev + 1)
                )
              }
              disabled={currentPage === Math.ceil(totalItems / pageSize)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => {
          setPageSize(Number(value))
          setCurrentPage(1)
        }}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 20, 50].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
