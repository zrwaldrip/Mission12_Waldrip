import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./context/CartContext";
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
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
