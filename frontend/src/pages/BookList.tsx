import { useEffect, useState } from "react";
import CartSummary from "../components/CartSummary";
import CategoryFilter from "../components/CategoryFilter";
import { useCart } from "../context/CartContext";
import type { Book } from "../types/Book";

/** API may serialize id as `bookID` or `bookId` depending on serializer settings. */
function mapBookFromApi(raw: Record<string, unknown>): Book {
  const id = raw.bookId ?? raw.bookID;
  return {
    bookId: typeof id === "number" ? id : Number(id),
    title: String(raw.title ?? ""),
    author: String(raw.author ?? ""),
    publisher: String(raw.publisher ?? ""),
    isbn: String(raw.isbn ?? ""),
    classification: String(raw.classification ?? ""),
    category: String(raw.category ?? ""),
    pageCount: Number(raw.pageCount ?? 0),
    price: Number(raw.price ?? 0),
  };
}

function BookList() {
  const { addItem } = useCart();
  const [projects, setProjects] = useState<Book[]>([]);

  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const categoriesParam =
        selectedCategories.length > 0
          ? `&categories=${encodeURIComponent(
              selectedCategories.join(",")
            )}`
          : "";
      const response = await fetch(
        `https://localhost:7169/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortAsc=${sortAsc}${categoriesParam}`
      );
      const data = await response.json();
      const rawBooks = (data.books ?? []) as Record<string, unknown>[];
      setProjects(rawBooks.map(mapBookFromApi));
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchProjects();
  }, [pageSize, pageNum, sortAsc, selectedCategories]);

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8">
            <h1>Book List</h1>
        <div className="form-check mb-3 d-flex justify-content-center align-items-center mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sortCheckbox"
            checked={sortAsc}
            onChange={(e) => setSortAsc(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="sortCheckbox">
            Sort Alphabetically (A-Z)
          </label>
        </div>

        <CategoryFilter
          selectedCategories={selectedCategories}
          onSelectedCategoriesChange={(cats) => {
            setSelectedCategories(cats);
            setPageNum(1);
          }}
        />

        <br />

        {projects.map((b) => (
          <div id="projectCard" className="card mb-3" key={b.bookId}>
            <div className="card-body">
              <h3 className="card-title h5">{b.title}</h3>
              <ul className="list-unstyled mb-3">
                <li>
                  <strong>Author:</strong> {b.author}
                </li>
                <li>
                  <strong>Publisher:</strong> {b.publisher}
                </li>
                <li>
                  <strong>ISBN:</strong> {b.isbn}
                </li>
                <li>
                  <strong>Classification/Category:</strong> {b.classification}/
                  {b.category}
                </li>
                <li>
                  <strong>Number of Pages:</strong> {b.pageCount}
                </li>
                <li>
                  <strong>Price:</strong> ${b.price}
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addItem(b)}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}

        <button
          disabled={pageNum <= 1 || totalPages === 0}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setPageNum(index + 1)}
            disabled={pageNum === index + 1}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={totalPages === 0 || pageNum >= totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>

        <br />
        <label>
          Results per Page:
          <select
            value={pageSize}
            onChange={(p) => {
              setPageSize(Number(p.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
          </div>
          <aside className="col-lg-4 mt-4 mt-lg-0">
            <div
              className="sticky-lg-top"
              style={{ top: "1rem", zIndex: 1 }}
            >
              <CartSummary />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default BookList;
