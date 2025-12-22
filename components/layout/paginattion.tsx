"use client"

import Link from "next/link"
import { Button } from "../ui/button"

interface PaginationProps {
  meta: {
    current_page: number
    total_pages: number
  },
  setPage?: (page: number) => void
}

export default function Pagination({ meta, setPage }: PaginationProps) {
  const { current_page, total_pages } = meta

  if (total_pages <= 1) return null

  return (
    <div className="flex gap-2 justify-center mt-4">
      {/* Previous */}
      {current_page > 1 && (
        <Button
          variant={"outline"}
          onClick={() => setPage && setPage(current_page - 1)}
          className="px-3 py-1 border rounded"
        >
          ←
        </Button>
      )}

      {/* Pages */}
      {Array.from({ length: total_pages }).map((_, i) => {
        const page = i + 1
        return (
          <Button
            variant={"outline"}
            key={page}
            onClick={() => setPage && setPage(page)}
            className={`px-3 py-1 border rounded ${
              page === current_page ? "bg-black text-white" : ""
            }`}
          >
            {page}
          </Button>
        )
      })}

      {/* Next */}
      {current_page < total_pages && (
        <Button
          variant={"outline"}
          onClick={() => setPage && setPage(current_page + 1)}
          className="px-3 py-1 border rounded"
        >
          →
        </Button>
      )}
    </div>
  )
}
