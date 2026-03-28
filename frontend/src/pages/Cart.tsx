import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { lineSubtotal } from "../types/CartItem";

function Cart() {
  const {
    items,
    removeItem,
    setQuantity,
    cartTotal,
    returnToPath,
  } = useCart();

  return (
    <div className="container mt-4">
            <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Books</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Cart
          </li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">Shopping Cart</h1>
        <Link className="btn btn-outline-primary" to={returnToPath}>
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">
          Your cart is empty.{" "}
          <Link to="/">Browse books</Link>
        </p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="text-end">Unit price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.bookId}>
                    <td>{item.title}</td>
                    <td className="text-end">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setQuantity(item.bookId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="btn btn-light disabled">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setQuantity(item.bookId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end">
                      ${lineSubtotal(item).toFixed(2)}
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.bookId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end">
            <p className="fs-5 mb-0">
              <strong>Total:</strong> ${cartTotal.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
