import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import SellerLayout from './pages/seller/SellerLayout';
import AddAddress from "./pages/AddAddress.jsx";
import Loading from './components/Loading.jsx';

<Route path="/add-address" element={<AddAddress />} />


const App = () => {
  const location = useLocation();
  const { showUserLogin, isSeller } = useAppContext();

  const isSellerPath = location.pathname.startsWith('/seller');

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div className={isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/loader" element={<Loading />} />

          <Route path="/seller" element={isSeller ? <Navigate to="/seller/add-product" /> : <SellerLogin />} />

          {isSeller && (
            <Route path="/seller/*" element={<SellerLayout />}>
              <Route path="add-product" element={<AddProduct />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          )}

          {!isSeller && <Route path="/seller/*" element={<Navigate to="/seller" />} />}
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
