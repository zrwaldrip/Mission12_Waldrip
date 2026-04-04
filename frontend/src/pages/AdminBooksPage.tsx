import { useCallback, useEffect, useState } from "react";
import type { Book } from "../types/Book";
import {
  deleteBook,
  fetchBooksForAdmin,
} from "../api/bookAPIs";
import Pagination from "../components/Pagination";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const reloadBooks = useCallback(async () => {
    const data = await fetchBooksForAdmin(pageSize, pageNum);
    setBooks(data.books);
    setTotalPages(Math.ceil(data.totalNumBooks / pageSize) || 0);
  }, [pageSize, pageNum]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        await reloadBooks();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reloadBooks]);

  const handleDelete = async (bookId: number) => {
    const ok = window.confirm("Are you sure you want to delete this book?");
    if (!ok) return;

    try {
      await deleteBook(bookId);
      await reloadBooks();
    } catch {
      alert("Failed to delete book, please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading books…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-danger">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-3">Admin — Books</h1>

      {!showForm && (
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => setShowForm(true)}
        >
          Add book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={async () => {
            setShowForm(false);
            try {
              await reloadBooks();
            } catch {
              setError("Failed to refresh list");
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={async () => {
            setEditingBook(null);
            try {
              await reloadBooks();
            } catch {
              setError("Failed to refresh list");
            }
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th style={{ width: "1%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookId}>
                <td>{b.bookId}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.publisher}</td>
                <td>{b.isbn}</td>
                <td>{b.classification}</td>
                <td>{b.category}</td>
                <td>{b.pageCount}</td>
                <td>${b.price}</td>
                <td className="text-nowrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => setEditingBook(b)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(b.bookId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

export default AdminBooksPage;
