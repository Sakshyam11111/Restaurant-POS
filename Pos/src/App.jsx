import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './component/mainpage/Landingpage';
import JoinUs from './component/mainpage/JoinUs';
import RestaurantLogin from './component/mainpage/RestaurantLogin';
import RestaurantSignup from './component/mainpage/RestaurantSignup';
import Pos from './component/POS/Pos';
import CustomerLogin from './component/mainpage/CustomerLogin';
import CustomerSignup from './component/mainpage/CustomerSignup';
import OrderDetailPage from './component/POS/contents/order/OrderDetailPage';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" 
          element={<LandingPage />} />
          <Route path="/joinus" element={<JoinUs />} />
          <Route path="/stafflogin" element={<RestaurantLogin />} />
          <Route path="/staffsignup" element={<RestaurantSignup />} />
          <Route path="/customerlogin" element={<CustomerLogin />} />
          <Route path="/customersignup" element={<CustomerSignup />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;