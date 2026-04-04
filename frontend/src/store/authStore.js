// Trung tâm điều khiển xác thực (Authencation Hub)
import {create} from "zustand";
import * as authService from "../services/authService";

export const useAuthStore = create((set) => ({
  // Thiết lập các biến trạng thái (Initial State)
  user: null,
  isAuthenticated: false,
  error: null, // Nơi chứa thông báo lỗi nếu có 
  isLoading: false, // Đợi Server phản hồi (true/false)
  isCheckingAuth: true, // Kiểm tra token cũ 
  // Hành động đăng kí (Action)
  signUp: async (userData) => {
    // Bắt đầu Load, xóa lỗi cũ
    set({isLoading: true, error: null});

    try{
      const response = await authService.signUp(userData);

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });

    }catch(error){

      set({
        error: error.response?.data?.message || "Lỗi đăng ký!", 
        isLoading: false
      });
      
      // Quăng lỗi ra để UI có thể xử lý (nếu cần)
      throw error; 
    }
  },
  // Hành động đăng nhập 
  signIn: async (credentials) => {
    // Bật Loading
    set({isLoading: true, error: null});

    try{
      const response = await authService.signIn(credentials);

      // Lưu Token vào localStorage để duy trì phiên làm việc 
      if(response.accessToken){
        localStorage.setItem("accessToken", response.accessToken);
      }

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });

    }catch(error){

      set({
        error: error.response?.data?.message || "Lỗi đăng nhập!", 
        isLoading: false
      });

      throw error;
    }
  },
  // Kiểm tra đăng nhập tự động (Check Auth)
  checkAuth: async () => {
    // Đang kiểm tra
    set({
      isCheckingAuth: true,
      error: null
    });

    try{
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await authService.getMe();

      set({
        user: response.user,
        isAuthenticated: true,
        isCheckingAuth: false
      });

    }catch(error){
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false
      })
    }
  },
  // Logout 
  logout: () => {

    localStorage.removeItem("accessToken");
    // Xóa token khỏi trình duyệt
    set({
      user: null,
      isAuthenticated: false 
    }); // Reset lại trạng thái 
  },
  // Hàm phụ trợ: Xóa thông báo lỗi 
  clearError: () => set({ error: null}),
}))