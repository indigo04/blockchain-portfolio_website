"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PrimaryButton } from "./PrimaryButton";

interface PaginationProps {
  totalPages: number;
}

export const Pagination = ({ totalPages }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageURL(page));
  };

  const getVisiblePages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 2) {
      pages.push(1, 2, "...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      pages.push(1, "...", totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, totalPages);
    }

    return pages;
  };

  const pages = getVisiblePages();

  //   if (totalPages <= 1) return null;

  return (
    <div
      className="flex items-center justify-center space-x-1 mt-6"
      aria-label="Pagination"
    >
      <PrimaryButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="pr-3 pl-3 pb-3 pt-3"
      >
        ←
      </PrimaryButton>

      <div className="flex space-x-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="p-2 rounded-xl font-bold text-primary/50 bg-transparent flex items-center justify-center"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              aria-current={isActive ? "page" : undefined}
              className={`py-3 px-4 rounded-xl font-bold transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-muted/25 cursor-pointer text-primary hover:bg-primarylight"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <PrimaryButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="pr-3 pl-3 pb-3 pt-3"
      >
        →
      </PrimaryButton>
    </div>
  );
};
