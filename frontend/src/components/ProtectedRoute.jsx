import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// children ở đây là những gì nằm bên trong <ProtectedRoute>...</ProtectedRoute>
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. Kiểm tra trạng thái từ bộ não trung tâm (authStore)
  // Nếu chưa đăng nhập (false), dùng <Navigate> để điều hướng về trang signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // 2. Nếu đã đăng nhập (true), cho phép xem nội dung bên trong
  return children;
};

export default ProtectedRoute;
