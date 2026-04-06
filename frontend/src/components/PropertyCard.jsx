import { MapPin, Maximize, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property, isActive }) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border group relative ${
      isActive ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'
    }`}>
      {/* 1. Phần Ảnh & Badge */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.status === "Còn phòng" && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              Còn phòng
            </span>
          )}
          {property.isPopular && (
            <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase">
              <Star size={10} fill="currentColor" /> Phổ biến
            </span>
          )}
        </div>
      </div>

      {/* 2. Thông tin chi tiết */}
      <div className="p-4">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xl font-bold text-slate-800">
            {property.price.toLocaleString('vi-VN')}
          </span>
          <span className="text-slate-500 text-sm">đ/tháng</span>
        </div>

        <h3 className="font-semibold text-slate-800 mb-1 truncate">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin size={14} />
          <span className="truncate">{property.location.district}, {property.location.city}</span>
        </div>

        {/* 3. Thông số kỹ thuật & Nút Chi tiết */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-4 text-slate-600 text-sm">
            <div className="flex items-center gap-1">
              <Maximize size={14} />
              <span>{property.area}m²</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-400" fill="currentColor" />
              <span>{property.rating}</span>
            </div>
          </div>

          <Link 
            to={`/property/${property._id}`}
            className="text-primary font-bold text-xs flex items-center gap-1 hover:underline"
          >
            CHI TIẾT <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
