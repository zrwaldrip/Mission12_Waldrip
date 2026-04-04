interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={currentPage <= 1 || totalPages === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          type="button"
          key={index + 1}
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={totalPages === 0 || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      <label className="ms-2 mb-0 d-flex align-items-center gap-1">
        Results per Page:
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>
    </div>
  );
}

export default Pagination;
