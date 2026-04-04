import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Nếu người dùng đã đăng nhập (true), đưa họ về trang chủ "/"
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập (false), cho họ xem trang Login/Signup bình thường
  return children;
};

export default RedirectAuthenticatedUser;
