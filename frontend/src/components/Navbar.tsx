import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav className="navbar navbar-expand-sm border-bottom bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Bookstore
        </Link>
        <div className="navbar-nav flex-row gap-3">
          <Link className="nav-link" to="/">
            Books
          </Link>
          <Link className="nav-link" to="/admin">
            Admin
          </Link>
          <Link className="nav-link" to="/cart">
            Cart{" "}
            {itemCount > 0 ? (
              <span className="badge text-bg-primary rounded-pill">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
