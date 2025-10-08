import React, { useState } from "react";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";

export const PaginationControlsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;

  const paginationData = [
    { page: 1, isActive: true },
    { page: 2, isActive: false },
    { page: 3, isActive: false },
    { page: "...", isEllipsis: true },
    { page: 67, isActive: false },
    { page: 68, isActive: false },
  ];

  const handlePageClick = (page) => {
    if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <nav
      className="inline-flex ml-[409px] w-[489px] h-[38px] relative items-center gap-2"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <button
        className={`justify-center gap-2 px-3 py-2 rounded-lg inline-flex items-center relative flex-[0_0_auto] ${isPreviousDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        aria-label="Go to previous page"
      >
        <ArrowLeft className="!relative !w-4 !h-4" />
        <span className="relative w-fit mt-[-1.00px] font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[#757575] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] whitespace-nowrap [font-style:var(--single-line-body-base-font-style)]">
          Previous
        </span>
      </button>

      <div
        className="gap-2 inline-flex items-center relative flex-[0_0_auto]"
        role="group"
        aria-label="Page numbers"
      >
        {paginationData.map((item, index) => (
          <React.Fragment key={index}>
            {item.isEllipsis ? (
              <div className="flex-col justify-center px-4 py-2 rounded-lg inline-flex items-center relative flex-[0_0_auto]">
                <span className="relative w-fit mt-[-1.00px] font-body-base-bold font-[number:var(--body-base-bold-font-weight)] text-black text-[length:var(--body-base-bold-font-size)] tracking-[var(--body-base-bold-letter-spacing)] leading-[var(--body-base-bold-line-height)] whitespace-nowrap [font-style:var(--body-base-bold-font-style)]">
                  ...
                </span>
              </div>
            ) : (
              <button
                className={`flex-col justify-center px-3 py-2 rounded-lg inline-flex items-center relative flex-[0_0_auto] hover:bg-gray-100 cursor-pointer ${
                  item.page === currentPage ? "bg-[#2c2c2c]" : ""
                }`}
                onClick={() => handlePageClick(item.page)}
                aria-label={`Go to page ${item.page}`}
                aria-current={item.page === currentPage ? "page" : undefined}
              >
                <span
                  className={`relative w-fit mt-[-1.00px] font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] whitespace-nowrap [font-style:var(--single-line-body-base-font-style)] ${
                    item.page === currentPage
                      ? "text-neutral-100"
                      : "text-[#1e1e1e]"
                  }`}
                >
                  {item.page}
                </span>
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        className={`justify-center gap-2 px-3 py-2 rounded-lg inline-flex items-center relative flex-[0_0_auto] ${isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label="Go to next page"
      >
        <span className="relative w-fit mt-[-1.00px] font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[#1e1e1e] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] whitespace-nowrap [font-style:var(--single-line-body-base-font-style)]">
          Next
        </span>
        <ArrowRight className="!relative !w-4 !h-4" />
      </button>
    </nav>
  );
};
