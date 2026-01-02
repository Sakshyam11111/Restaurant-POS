import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './component/mainpage/Landingpage';
import JoinUs from './component/mainpage/JoinUs';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/joinus" element={<JoinUs />} />
        </Routes>
      </Router>
    </>
  )
}

export default App