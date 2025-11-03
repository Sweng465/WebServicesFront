const Pagination = ({ currentPage = 1, setPage, totalPages = 1, hasNextPage, hasPreviousPage, total, limit }) => {
  // Helper: build a compact range of page numbers around current page
  const buildPageRange = (current, total, delta = 2) => {
    const range = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);

    for (let i = left; i <= right; i++) range.push(i);

    // Always include first/last if outside range
    if (left > 2) {
      range.unshift("...");
      range.unshift(1);
    } else if (left === 2) {
      range.unshift(1);
    }

    if (right < total - 1) {
      range.push("...");
      range.push(total);
    } else if (right === total - 1) {
      range.push(total);
    }

    return range;
  };

  const totalNum = Number(totalPages) || 1;

  const disablePrev = typeof hasPreviousPage === "boolean" ? !hasPreviousPage : currentPage <= 1;
  const disableNext = typeof hasNextPage === "boolean" ? !hasNextPage : currentPage >= totalNum;

  const pageRange = buildPageRange(Number(currentPage), totalNum, 2);

  const startItem = total && limit ? (currentPage - 1) * limit + 1 : null;
  const endItem = total && limit ? Math.min(currentPage * limit, total) : null;

  return (
    <div className="flex flex-col items-center mt-8 gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPage((p) => {
            const next = typeof p === 'number' ? Math.max(p - 1, 1) : Math.max(currentPage - 1, 1);
            return next;
          })}
          disabled={disablePrev}
          className="px-3 py-2 bg-white bg-opacity-80 rounded-md text-gray-800 hover:bg-opacity-100 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="inline-flex items-center gap-1">
          {pageRange.map((p, idx) =>
            p === "..." ? (
              <span key={`dot-${idx}`} className="px-3 py-2 text-gray-600">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(Number(p))}
                aria-current={Number(p) === Number(currentPage)}
                className={`px-3 py-2 rounded-md font-medium ${Number(p) === Number(currentPage) ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-80 text-gray-800 hover:bg-opacity-100'}`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => setPage((p) => {
            const next = typeof p === 'number' ? Math.min(p + 1, totalNum) : Math.min(currentPage + 1, totalNum);
            return next;
          })}
          disabled={disableNext}
          className="px-3 py-2 bg-white bg-opacity-80 rounded-md text-gray-800 hover:bg-opacity-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="text-sm text-gray-600 mt-1">
        {total && limit ? (
          <span>
            Showing {startItem}–{endItem} of {total}
          </span>
        ) : (
          <span>
            Page {currentPage} of {totalNum}
          </span>
        )}
      </div>
    </div>
  );
};

export default Pagination;
