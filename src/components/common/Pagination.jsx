function getPageNumbers(currentPage, totalPages) {
  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
    .reduce((result, page, index, array) => {
      if (index > 0 && page - array[index - 1] > 1) {
        result.push("ellipsis-" + page);
      }

      result.push(page);
      return result;
    }, []);
}

function Pagination({
  page,
  currentPage,
  totalPages,
  total,
  limit,
  pageSize,
  onPageChange,
  disabled = false,
  className = "",
}) {
  const activePage = Math.max(1, Number(currentPage ?? page) || 1);
  const effectiveLimit = Math.max(1, Number(pageSize ?? limit) || 10);
  const effectiveTotal = Math.max(0, Number(total) || 0);
  const pagesCount = Math.max(
    1,
    Number(totalPages) || Math.ceil(effectiveTotal / effectiveLimit),
  );

  const safePage = Math.min(activePage, pagesCount);
  const start = effectiveTotal === 0 ? 0 : (safePage - 1) * effectiveLimit + 1;
  const end = Math.min(safePage * effectiveLimit, effectiveTotal);

  if (pagesCount <= 1 && effectiveTotal <= effectiveLimit) {
    return null;
  }

  const pages = getPageNumbers(safePage, pagesCount);

  const buttonBase =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40";

  function changePage(nextPage) {
    if (
      disabled ||
      typeof onPageChange !== "function" ||
      nextPage < 1 ||
      nextPage > pagesCount ||
      nextPage === safePage
    ) {
      return;
    }

    onPageChange(nextPage);
  }

  return (
    <nav
      aria-label="Pagination"
      className={[
        "flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-center text-xs text-slate-500 sm:text-left sm:text-sm">
        Showing <span className="font-semibold text-slate-800">{start}</span>
        {"–"}
        <span className="font-semibold text-slate-800">{end}</span>
        {" of "}
        <span className="font-semibold text-slate-800">
          {effectiveTotal.toLocaleString()}
        </span>
        {" records"}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          aria-label="Go to previous page"
          disabled={disabled || safePage <= 1}
          onClick={() => changePage(safePage - 1)}
          className={[
            buttonBase,
            "w-auto gap-1.5 px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pages.map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              aria-hidden="true"
              className="flex size-9 items-center justify-center text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Go to page ${item}`}
              aria-current={item === safePage ? "page" : undefined}
              disabled={disabled}
              onClick={() => changePage(item)}
              className={[
                buttonBase,
                item === safePage
                  ? "bg-orange-600 text-white shadow-sm hover:bg-orange-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Go to next page"
          disabled={disabled || safePage >= pagesCount}
          onClick={() => changePage(safePage + 1)}
          className={[
            buttonBase,
            "w-auto gap-1.5 px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          ].join(" ")}
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
