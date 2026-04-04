import { useState } from "react";
import type { Book } from "../types/Book";
import { updateBook } from "../api/bookAPIs";

interface EditBookFormProps {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

function EditBookForm({ book, onSuccess, onCancel }: EditBookFormProps) {
  const [formData, setFormData] = useState<Book>({ ...book });

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
    await updateBook(formData.bookId, formData);
    onSuccess();
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="h5 card-title">Edit book</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-title">
                Title
              </label>
              <input
                id="edit-title"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-author">
                Author
              </label>
              <input
                id="edit-author"
                className="form-control"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-publisher">
                Publisher
              </label>
              <input
                id="edit-publisher"
                className="form-control"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-isbn">
                ISBN
              </label>
              <input
                id="edit-isbn"
                className="form-control"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-classification">
                Classification
              </label>
              <input
                id="edit-classification"
                className="form-control"
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-category">
                Category
              </label>
              <input
                id="edit-category"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-pageCount">
                Page count
              </label>
              <input
                id="edit-pageCount"
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
              <label className="form-label" htmlFor="edit-price">
                Price
              </label>
              <input
                id="edit-price"
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
              Update book
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

export default EditBookForm;
