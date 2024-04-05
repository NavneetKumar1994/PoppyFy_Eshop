import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Header from "./components/layOuts/Header";
import Footer from "./components/layOuts/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

//Cart Imports
import Cart from "./components/cartDetail/Cart";
import Shipping from "./components/cartDetail/Shipping";
import ConfirmOrder from "./components/cartDetail/ConfirmOrder";
import Payment from "./components/cartDetail/Payment";
import OrderSuccess from "./components/cartDetail/OrderSuccess";

//order details
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";

//Auth or user imports
import LoginUser from "./components/user/LoginUser";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import UpdateProfle from "./components/user/UpdateProfle";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

//Admin imports
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";

import ProtectedRoute from "./components/route/ProtectedRoute";
import { loadUser } from "./actions/userActions";
import { useSelector } from 'react-redux'
import store from './store'

//payment
import "./App.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripeapi")
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeApiKey();
  }, []);

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)


  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/search/:keyword" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route path="/cart" element={<Cart />} exact />
            {/* two other routes are protected outside the routes-Shipping and ConfirmOrder */}

            <Route path="/login" element={<LoginUser />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<NewPassword />} />
          </Routes>

          <ProtectedRoute path="/shipping" element={<Shipping />} exact />
          <ProtectedRoute path="/confirm" element={<ConfirmOrder />} />
          <ProtectedRoute path="/success" element={<OrderSuccess/>} />

          <ProtectedRoute path="/me" element={<Profile />} exact />
          <ProtectedRoute path="/me/update" element={<UpdateProfle />} />
          <ProtectedRoute path="/password/update" element={<UpdatePassword />} />
          <ProtectedRoute path="/orders/me" element={<ListOrders/>} exact />
          <ProtectedRoute path="/order/:id" element={<OrderDetails/>} exact />


          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" element={<Payment />} />
            </Elements>
          )}
          </div>

          <ProtectedRoute path="/dashboard" isAdmin={true} element={<Dashboard/>} exact />
          <ProtectedRoute path="/admin/products" isAdmin={true} element={<ProductsList/>} exact />
          <ProtectedRoute path="/admin/product" isAdmin={true} element={<NewProduct/>} exact />
          <ProtectedRoute path="/admin/product/:id" isAdmin={true} element={<UpdateProduct/>} exact />
          <ProtectedRoute path="/admin/orders" isAdmin={true} element={<OrdersList/>} exact />
          <ProtectedRoute path="/admin/order/:id" isAdmin={true} element={<ProcessOrder/>} exact />
          <ProtectedRoute path="/admin/users" isAdmin={true} element={<UsersList/>} exact />
          <ProtectedRoute path="/admin/user/:id" isAdmin={true} element={<UpdateUser/>} exact />
          <ProtectedRoute path="/admin/reviews" isAdmin={true} element={<ProductReviews/>} exact />

          {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
           )}      
        </div>
    </Router>
  );
}

export default App;
