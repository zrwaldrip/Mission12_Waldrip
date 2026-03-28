import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Book } from "../types/Book";
import type { CartItem } from "../types/CartItem";
import { lineSubtotal } from "../types/CartItem";

const STORAGE_KEY = "bookstore_cart_session";

type PersistedState = {
  items: CartItem[];
  returnToPath: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  setQuantity: (bookId: number, quantity: number) => void;
  cartTotal: number;
  itemCount: number;
  /** Path to use for “Continue Shopping” (where the user was when they last added an item). */
  returnToPath: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadPersisted(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], returnToPath: "/" };
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [], returnToPath: "/" };
    }
    return {
      items: parsed.items,
      returnToPath:
        typeof parsed.returnToPath === "string" && parsed.returnToPath
          ? parsed.returnToPath
          : "/",
    };
  } catch {
    return { items: [], returnToPath: "/" };
  }
}

function persist(items: CartItem[], returnToPath: string) {
  const payload: PersistedState = { items, returnToPath };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = loadPersisted();
  const [items, setItems] = useState<CartItem[]>(() => initial.items);
  const [returnToPath, setReturnToPath] = useState<string>(
    () => initial.returnToPath
  );

  useEffect(() => {
    persist(items, returnToPath);
  }, [items, returnToPath]);

  const addItem = useCallback((book: Book) => {
    const path =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/";
    setReturnToPath(path);

    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === book.bookId);
      if (existing) {
        return prev.map((i) =>
          i.bookId === book.bookId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      const next: CartItem = {
        bookId: book.bookId,
        title: book.title,
        unitPrice: book.price,
        quantity: 1,
      };
      return [...prev, next];
    });
  }, []);

  const removeItem = useCallback((bookId: number) => {
    setItems((prev) => prev.filter((i) => i.bookId !== bookId));
  }, []);

  const setQuantity = useCallback((bookId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.bookId !== bookId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.bookId === bookId ? { ...i, quantity } : i
      )
    );
  }, []);

  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + lineSubtotal(i), 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      cartTotal,
      itemCount,
      returnToPath,
    }),
    [
      items,
      addItem,
      removeItem,
      setQuantity,
      cartTotal,
      itemCount,
      returnToPath,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
