import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * Compact cart summary for the book list page (session totals + link to full cart).
 */
export default function CartSummary() {
  const { items, cartTotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="card border-secondary mb-4">
        <div className="card-body py-3">
          <h2 className="h6 card-title mb-2">Cart</h2>
          <p className="text-muted small mb-0">No items yet.</p>
          <Link to="/cart" className="btn btn-sm btn-outline-primary mt-2">
            View cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-primary mb-4">
      <div className="card-body py-3">
        <h2 className="h6 card-title mb-2">Cart summary</h2>
        <p className="mb-1 small">
          <strong>{itemCount}</strong> item{itemCount !== 1 ? "s" : ""} in cart
        </p>
        <p className="mb-2">
          <strong>Total:</strong> ${cartTotal.toFixed(2)}
        </p>
        <Link to="/cart" className="btn btn-sm btn-primary">
          View cart
        </Link>
      </div>
    </div>
  );
}
