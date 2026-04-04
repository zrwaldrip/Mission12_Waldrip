import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import AdminBooksPage from "./pages/AdminBooksPage";
import BookList from "./pages/BookList";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminBooksPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
