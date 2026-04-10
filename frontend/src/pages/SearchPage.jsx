import React, { useEffect, useState } from "react";
import { usePropertyStore } from "../store/propertyStore";
import PropertyCard from "../components/PropertyCard";
import PropertyCardSkeleton from "../components/PropertyCardSkeleton";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PropertyMap from "../components/PropertyMap";
import { SlidersHorizontal, Map as MapIcon, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";

const SearchPage = () => {
  const { properties, fetchProperties, isLoading, pagination } = usePropertyStore();
  const [activePropertyId, setActivePropertyId] = React.useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  // 1. Khởi động: Gọi dữ liệu ngay khi trang vừa load
  useEffect(() => {
    fetchProperties({ page: 1 });
  }, [fetchProperties]);

  const handleSearch = (filters) => {
    const newFilters = { ...filters, page: 1 };
    setCurrentFilters(filters);
    fetchProperties(newFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchProperties({ ...currentFilters, page: newPage });
    // Scroll lên đầu danh sách
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28 px-6 max-w-[1600px] mx-auto pb-10">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                Khám phá chỗ ở
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Tìm thấy <span className="text-blue-600 font-bold">{pagination.total}</span> kết quả
                {pagination.totalPages > 1 && (
                  <span className="text-slate-400 ml-1">
                    — Trang {pagination.page}/{pagination.totalPages}
                  </span>
                )}
              </p>
            </div>

            {/* Quick Filters/View Toggle */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:shadow-md transition-all active:scale-95">
                <SlidersHorizontal size={18} className="text-blue-500" /> 
                <span>Bộ lọc nâng cao</span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
              <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                <button className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 transition-all">
                  <LayoutGrid size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <MapIcon size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto w-full -mb-4 relative z-10">
             <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Bố cục chính: Danh sách & Bản đồ */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Lưới hiển thị các căn hộ (60%) */}
          <div className="w-full lg:w-[60%]">
            {isLoading ? (
              // Skeleton Loading với đúng số lượng cards
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-4xl mb-4">🏠</p>
                <p className="text-slate-500 font-medium">Không tìm thấy kết quả phù hợp</p>
                <p className="text-slate-400 text-sm mt-1">Hãy thử thay đổi bộ lọc tìm kiếm</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((item) => (
                    <div 
                      key={item._id} 
                      id={`property-${item._id}`}
                      onMouseEnter={() => setActivePropertyId(item._id)}
                      onMouseLeave={() => setActivePropertyId(null)}
                    >
                      <PropertyCard 
                        property={item} 
                        isActive={activePropertyId === item._id} 
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">…</span>
                          ) : (
                            <button
                              key={item}
                              onClick={() => handlePageChange(item)}
                              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                item === pagination.page
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {item}
                            </button>
                          )
                        )
                      }
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cột phải: Bản đồ thực tế (Leaflet Map Integration) */}
          <div className="hidden lg:block w-[40%]">
             <div className="sticky top-28 h-[calc(100vh-140px)] z-0 shadow-2xl">
                <PropertyMap 
                  properties={properties} 
                  onMarkerClick={(id) => {
                    setActivePropertyId(id);
                    document.getElementById(`property-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  activeId={activePropertyId}
                />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SearchPage;
