import type { Book } from "../types/Book";

const API_URL = "https://localhost:7169/api/Book";

export interface FetchBooksForAdminResponse {
  books: Book[];
  totalNumBooks: number;
}

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

/** Body shape for POST/PUT (matches API camelCase binding). */
function bookToJsonBody(book: Book): Record<string, unknown> {
  return {
    bookID: book.bookId,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    isbn: book.isbn,
    classification: book.classification,
    category: book.category,
    pageCount: book.pageCount,
    price: book.price,
  };
}

export async function fetchBooksForAdmin(
  pageSize: number,
  pageNum: number
): Promise<FetchBooksForAdminResponse> {
  const response = await fetch(
    `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortAsc=false`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  const data = (await response.json()) as Record<string, unknown>;
  const rawBooks = (data.books ?? data.Books ?? []) as Record<string, unknown>[];
  const total =
    typeof data.totalNumBooks === "number"
      ? data.totalNumBooks
      : Number(data.TotalNumBooks ?? 0);
  return {
    books: rawBooks.map(mapBookFromApi),
    totalNumBooks: total,
  };
}

export async function addBook(newBook: Book): Promise<Book> {
  const response = await fetch(`${API_URL}/AddBook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookToJsonBody(newBook)),
  });
  if (!response.ok) {
    throw new Error("Failed to add book");
  }
  const raw = (await response.json()) as Record<string, unknown>;
  return mapBookFromApi(raw);
}

export async function updateBook(bookId: number, updatedBook: Book): Promise<Book> {
  const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookToJsonBody({ ...updatedBook, bookId })),
  });
  if (!response.ok) {
    throw new Error("Failed to update book");
  }
  const raw = (await response.json()) as Record<string, unknown>;
  return mapBookFromApi(raw);
}

export async function deleteBook(bookId: number): Promise<void> {
  const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
}
