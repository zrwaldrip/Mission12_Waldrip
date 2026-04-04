import { useState } from "react";
import type { Book } from "../types/Book";
import { addBook } from "../api/bookAPIs";

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyBook = (): Book => ({
  bookId: 0,
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  classification: "",
  category: "",
  pageCount: 0,
  price: 0,
});

function NewBookForm({ onSuccess, onCancel }: NewBookFormProps) {
  const [formData, setFormData] = useState<Book>(emptyBook);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "pageCount" || name === "price") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook(formData);
    onSuccess();
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="h5 card-title">Add a new book</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-title">
                Title
              </label>
              <input
                id="new-title"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-author">
                Author
              </label>
              <input
                id="new-author"
                className="form-control"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-publisher">
                Publisher
              </label>
              <input
                id="new-publisher"
                className="form-control"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-isbn">
                ISBN
              </label>
              <input
                id="new-isbn"
                className="form-control"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-classification">
                Classification
              </label>
              <input
                id="new-classification"
                className="form-control"
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-category">
                Category
              </label>
              <input
                id="new-category"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-pageCount">
                Page count
              </label>
              <input
                id="new-pageCount"
                className="form-control"
                type="number"
                name="pageCount"
                min={0}
                value={formData.pageCount || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-price">
                Price
              </label>
              <input
                id="new-price"
                className="form-control"
                type="number"
                name="price"
                min={0}
                step="0.01"
                value={formData.price || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Add book
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBookForm;
