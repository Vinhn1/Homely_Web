import React, { useEffect } from "react";
import { usePropertyStore } from "../store/propertyStore";
import PropertyCard from "../components/PropertyCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PropertyMap from "../components/PropertyMap";
import { SlidersHorizontal, Map as MapIcon, LayoutGrid, Loader } from "lucide-react";

const SearchPage = () => {
  const { properties, fetchProperties, isLoading } = usePropertyStore();
  const [activePropertyId, setActivePropertyId] = React.useState(null);

  // 1. Khởi động: Gọi dữ liệu ngay khi trang vừa load
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (filters) => {
    fetchProperties(filters);
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
                Tìm thấy <span className="text-blue-600 font-bold">{properties.length}</span> kết quả phù hợp với yêu cầu của bạn
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

          {/* Real Search Bar Integration */}
          <div className="max-w-5xl mx-auto w-full -mb-4 relative z-10">
             <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Bố cục chính: Danh sách & Bản đồ */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Lưới hiển thị các căn hộ (60%) */}
          <div className="w-full lg:w-[60%]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[380px] bg-slate-200 rounded-2xl"></div>
                ))}
              </div>
            ) : (
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
