import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './features/ProductList/ProductList';
import ProductDetail from './features/ProductDetail/ProductDetail';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
