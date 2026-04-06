import { create } from 'zustand';
import axios from '../api/axios';

export const usePropertyStore = create((set) => ({
    // Danh sách phòng hiển thị trên màn hình 
    properties: [],
    // Căn hộ đang được xem chi tiết
    selectedProperty: null,
    isLoading: false,
    error: null,

    // Hàm gọi API lấy danh sách (có hỗ trợ lọc)
    fetchProperties: async (filters = {}) => {
        set({isLoading: true, error: null});
        try{
             // Chuyển đối tượng filters {city: 'Vinh Long'} thành query string "?city=VinhLong"
             const response = await axios.get("/properties", {params: filters});
             set({
                properties: response.data.data,
                isLoading: false
             });

        }catch(error){
            set({
                error: error.response?.data?.message || "Lỗi tải dữ liệu",
                isLoading: true
            });
        }
    },

    // Hàm lấy chi tiết 1 căn hộ theo ID 
    fetchPropertyById: async (id) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.get(`/properties/${id}`);
            set({selectedProperty: response.data.data, isLoading: false});
        }catch(error){
            set({error: "Không tìm thấy thông tin căn hộ", isLoading: false});
        }
    }

}))