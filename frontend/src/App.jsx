import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import { Routes, Route } from 'react-router-dom';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/placeOrder/PlaceOrder';
import Footer from './components/footer/Footer';
import LoginPopup from './components/loginPopup/LoginPopup';
import Profile from './components/profile/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StoreContextProvider from './storeContext/StoreContext';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <StoreContextProvider>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className="App">
          <Navbar setShowLogin={setShowLogin} />
          <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </StoreContextProvider>
    </>
  );
}

export default App;
