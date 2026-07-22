import { useMemo, useState } from "react";

export function usePagination(data = [], pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const items = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return {
    items,
    page,
    pageSize,
    setPage,
    totalPages,
  };
}
