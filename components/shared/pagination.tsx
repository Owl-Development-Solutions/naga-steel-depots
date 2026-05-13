import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export function DataPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{start}</span>
        {" – "}
        <span className="font-semibold text-slate-700">{end}</span>
        {" of "}
        <span className="font-semibold text-slate-700">
          {total.toLocaleString()}
        </span>{" "}
        records
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPage(page - 1);
              }}
              className={page <= 1 ? "pointer-events-none opacity-40" : ""}
            />
          </PaginationItem>
          {getPageNumbers().map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPage(p as number);
                  }}
                  className={
                    p === page
                      ? "bg-[#173c56] text-white border-[#173c56] hover:bg-[#173c56] hover:text-white"
                      : ""
                  }
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPage(page + 1);
              }}
              className={
                page >= totalPages ? "pointer-events-none opacity-40" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
