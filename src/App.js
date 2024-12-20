import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import CourseList from './components/CourseList';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import VerifyPage from './pages/Verify/VerifyPage';
import EnterCodePage from './pages/ForgotPassword/EnterCodePage';
import EnterEmailPage from './pages/ForgotPassword/EnterEmailPage';
import ResetPasswordPage from './pages/ForgotPassword/ResetPasswordPage';
import ProfilePage from './pages/Profile/ProfilePage';
import CourseDetail from './components/CourseDetail';
import AddCourse from './components/AddCourse';
import { useState } from 'react';
import Cart from './components/Cart';
import Wishlist from './components/WishList';
import MyPurchases from './pages/MyPurchases/MyPurchases';
import EditCourse from './components/EditCourse';

function App() {
  const [searchParams, setSearchParams] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  return (
    <Router>
      <Header
        onSearch={(params) => {
          setSearchParams(params);
        }}
      />
      <Routes>
        <Route path="/" element={<CourseList setCartCount={setCartCount} onSearch={(loadCourses) => loadCourses(searchParams)} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<EnterEmailPage />} />
        <Route path="/forgot-password/enter-code" element={<EnterCodePage />} />
        <Route path="/forgot-password/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
      </Routes>
    </Router>
  );
}

export default App;
