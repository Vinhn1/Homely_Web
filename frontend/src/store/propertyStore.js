import { create } from 'zustand';
import axios from '../api/axios';

export const usePropertyStore = create((set) => ({
    // Danh sách ID bất động sản yêu thích
    favorites: JSON.parse(localStorage.getItem('homely_favorites')) || [],
    // Danh sách phòng hiển thị trên màn hình 
    properties: [],
    // Căn hộ đang được xem chi tiết
    selectedProperty: null,
    isLoading: false,
    error: null,
    // Pagination metadata
    pagination: { page: 1, totalPages: 1, total: 0, limit: 12 },

    // Hàm gọi API lấy danh sách (có hỗ trợ lọc + pagination)
    fetchProperties: async (filters = {}) => {
        set({isLoading: true, error: null});
        try{
             const response = await axios.get("/properties", {params: filters});
             set({
                properties: response.data.data,
                pagination: {
                    page: response.data.page || 1,
                    totalPages: response.data.totalPages || 1,
                    total: response.data.total || 0,
                    limit: response.data.limit || 12,
                },
                isLoading: false
             });
        }catch(error){
            set({
                error: error.response?.data?.message || "Lỗi tải dữ liệu",
                isLoading: false
            });
        }
    },

    // Hàm toggle yêu thích
    toggleFavorite: (propertyId) => {
        set((state) => {
            const isFavorite = state.favorites.includes(propertyId);
            const newFavorites = isFavorite
                ? state.favorites.filter(id => id !== propertyId)
                : [...state.favorites, propertyId];
            
            localStorage.setItem('homely_favorites', JSON.stringify(newFavorites));
            return { favorites: newFavorites };
        });
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
    },

    // Hàm gửi đánh giá mới
    addReview: async (propertyId, reviewData) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`/properties/${propertyId}/reviews`, reviewData);
            
            // Cập nhật lại selectedProperty với review mới và rating mới
            set((state) => {
                if (state.selectedProperty && state.selectedProperty._id === propertyId) {
                    const newReviews = [response.data.data, ...(state.selectedProperty.reviews || [])];
                    return {
                        selectedProperty: {
                            ...state.selectedProperty,
                            reviews: newReviews,
                            // Backend đã trả về rating mới trong DB, nhưng ta có thể tạm thời cập nhật ở đây hoặc refetch
                        },
                        isLoading: false
                    };
                }
                return { isLoading: false };
            });

            // Gọi lại fetch để đồng bộ chính xác rating/count từ server
            await usePropertyStore.getState().fetchPropertyById(propertyId);
            
            return { success: true, message: response.data.message };
        } catch (error) {
            set({ isLoading: false });
            return { 
                success: false, 
                message: error.response?.data?.message || "Lỗi gửi đánh giá" 
            };
        }
    }

}))