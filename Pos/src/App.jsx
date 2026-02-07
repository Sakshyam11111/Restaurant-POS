import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './component/mainpage/landingpage/Landingpage';
import Pos from './component/POS/Pos';
import OrderDetailPage from './component/POS/contents/order/OrderDetailPage';
import POSMenu from './component/POS/contents/menu/POSMenu';
import HomeContent from './component/POS/contents/HomeContent';
import UnitMaster from './component/POS/master/unitmaster';
import POSContent from './component/POS/contents/POSContent';
import Login from './component/mainpage/Login';
import Signup from './component/mainpage/Signup';
import AdminLogin from './component/mainpage/AdminLogin';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
          <Route path="/posmenu" element={<POSMenu />} />

          <Route path="/homecontent" element={<HomeContent />} />
          <Route path="/poscontent" element={<POSContent />} />
          <Route path="/unitmaster" element={<UnitMaster />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;