import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { Loader } from "lucide-react";
import ProtectedRoute from './components/ProtectedRoute';
import RedirectAuthenticatedUser from './components/RedirectAuthenticatedUser';
import ProfilePage from "./pages/dashboard/shared/ProfilePage";
import DashboardLayout from './layouts/DashboardLayout';




function App() {

  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Chặn UI khi đang check 
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-slate-600 animate-pulse">
          Đang kết nối với Homely...
        </p>
      </div>
    );
  }
  return (
    <> 
      <Toaster position='top-right' richColors/>
      <Routes>
        {/* 1. Trang chủ: Cần bảo vệ nghiêm ngặt */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Trang Đăng nhập: Nếu login rồi thì đừng cho vào nữa */}
        <Route path="/signin" element={
          <RedirectAuthenticatedUser>
            <SignInPage />
          </RedirectAuthenticatedUser>
          } />

        {/* 3. Trang Đăng ký: Tương tự như Đăng nhập */}
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
             <SignUpPage />
          </RedirectAuthenticatedUser>
        } />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Các trang con sẽ nằm ở đây */}
        <Route path="profile" element={<ProfilePage />} /> 
       </Route>
      </Routes>
    </>
   
  );
}

export default App
