import { create } from 'zustand';
import axios from '../api/axios';

export const useBookingStore = create((set) => ({
    // Danh sách đơn đặt phòng của tôi
    myBookings: [],
    isLoading: false,
    error: null,

    // Gửi yêu cầu đặt phòng mới
    createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/bookings", bookingData);
            set({ isLoading: false });
            return { success: true, message: response.data.message };
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Lỗi đặt phòng";
            set({ isLoading: false, error: errorMsg });
            return { success: false, message: errorMsg };
        }
    },

    // Lấy danh sách yêu cầu của tôi
    fetchMyBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/bookings/me");
            set({ 
                myBookings: response.data.data, 
                isLoading: false 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Lỗi tải lịch sử đặt phòng", 
                isLoading: false 
            });
        }
    },

    // Huỷ đặt phòng
    cancelBooking: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.patch(`/bookings/${id}/cancel`);
            // Cập nhật lại trạng thái trong danh sách hiện tại
            set((state) => ({
                myBookings: state.myBookings.map(b => 
                    b._id === id ? { ...b, status: 'cancelled' } : b
                ),
                isLoading: false
            }));
            return { success: true, message: response.data.message };
        } catch (error) {
            set({ isLoading: false });
            return { 
                success: false, 
                message: error.response?.data?.message || "Lỗi hủy đặt phòng" 
            };
        }
    }
}));
