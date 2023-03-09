import { useState } from "react";

interface PaginationOptions {
  pageSize: number;
}

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  items: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function usePagination<T>(
  array: T[],
  options: PaginationOptions = { pageSize: 10 }
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(array.length / options.pageSize);

  const startIndex = currentPage * options.pageSize;
  const endIndex = startIndex + options.pageSize;

  const items = array.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return { currentPage, totalPages, items, goToPage, nextPage, prevPage };
}

export default usePagination;
