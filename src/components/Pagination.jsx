const Pagination = ({ currentPage, setPage, totalPages }) => {
  return (
    <div className="flex justify-center mt-10 gap-3">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-white bg-opacity-80 rounded-md text-gray-800 hover:bg-opacity-100 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-4 py-2 bg-white bg-opacity-80 rounded-md text-gray-800 font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-white bg-opacity-80 rounded-md text-gray-800 hover:bg-opacity-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
