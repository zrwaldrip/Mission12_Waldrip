import { useEffect, useState } from "react";
import type { Book } from "./types/Book";

function BookList() {
  const [projects, setProjects] = useState<Book[]>([]);

  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(
        `https://localhost:7169/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortAsc=${sortAsc}`
      );
      const data = await response.json();
      setProjects(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchProjects();
  }, [pageSize, pageNum, totalItems, sortAsc]);

  return (
    <>
      <div className="container mt-4">
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
        <br />

        {projects.map((b) => (
          <div id="projectCard" className="card" key={b.bookId}>
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
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
            </div>
          </div>
        ))}

        <button
          disabled={pageNum === 1}
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
          disabled={pageNum === totalPages}
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
    </>
  );
}

export default BookList;
