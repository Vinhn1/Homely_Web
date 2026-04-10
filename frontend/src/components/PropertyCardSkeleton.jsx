/**
 * PropertyCardSkeleton — Skeleton loading cho PropertyCard
 * Giữ đúng layout & kích thước của card thật để tránh layout shift
 */
const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-slate-200 w-full" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="h-6 bg-slate-200 rounded-lg w-1/2" />

        {/* Title */}
        <div className="h-4 bg-slate-200 rounded-lg w-4/5" />

        {/* Location */}
        <div className="h-4 bg-slate-200 rounded-lg w-2/3" />

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          {/* Stats */}
          <div className="flex gap-4">
            <div className="h-4 bg-slate-200 rounded w-12" />
            <div className="h-4 bg-slate-200 rounded w-8" />
          </div>
          {/* Button */}
          <div className="h-4 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
