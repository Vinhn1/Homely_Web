import Property from "../models/Property.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import Amenity from "../models/Amenity.js";
import District from "../models/District.js";
import { cloudinary } from "../middlewares/upload.middleware.js";

// ===================================================
// PUBLIC ROUTES
// ===================================================

// GET /api/properties — Lấy danh sách + Tìm kiếm + Lọc
export const getProperties = async (req, res) => {
    try {
        const { city, district, category, minPrice, maxPrice, search } = req.query;

        let query = { listingStatus: 'active' }; // Chỉ lấy tin đang hoạt động

        if (city) query["location.city"] = city;
        if (district) query["location.district"] = district;
        
        if (category) {
            // Nếu category là ObjectId hợp lệ, lọc trực tiếp
            if (category.match(/^[0-9a-fA-F]{24}$/)) {
                query.category = category;
            } else {
                // Nếu là tên (như "Phòng trọ"), ta tìm ID của nó
                const catObj = await Category.findOne({ name: category });
                if (catObj) query.category = catObj._id;
                else query.category = null; // Không tìm thấy thì trả về rỗng
            }
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // ===== PAGINATION =====
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
        const skip = (page - 1) * limit;

        const [properties, total] = await Promise.all([
            Property.find(query)
                .populate("owner", "displayName avatarUrl phone")
                .populate("category", "name icon")
                .populate("amenities", "name icon")
                .populate("location.district", "name city")
                .sort({ isPromoted: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Property.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            page,
            totalPages,
            limit,
            data: properties,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/properties/:id — Chi tiết 1 căn hộ
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $inc: { viewCount: 1 } }, // Tăng lượt xem
            { returnDocument: 'after' }
        )
        .populate("owner", "displayName avatarUrl bio phone")
        .populate("category", "name icon description")
        .populate("amenities", "name icon category")
        .populate("location.district", "name city");

        if (!property) {
            return res.status(404).json({ success: false, message: "Không tìm thấy căn hộ" });
        }

        const reviews = await Review.find({ property: req.params.id })
            .populate("user", "displayName avatarUrl")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                ...property._doc,
                reviews
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /:id/reviews — Thêm đánh giá
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const propertyId = req.params.id;
        const userId = req.user._id;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Không tìm thấy căn hộ để đánh giá." });
        }

        const review = await Review.create({
            property: propertyId,
            user: userId,
            rating: Number(rating),
            comment
        });

        const allReviews = await Review.find({ property: propertyId });
        const reviewCount = allReviews.length;
        const averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount;

        property.rating = Number(averageRating.toFixed(1));
        property.reviewCount = reviewCount;
        await property.save();

        const populatedReview = await Review.findById(review._id).populate("user", "displayName avatarUrl");

        res.status(201).json({
            success: true,
            message: "Đánh giá đã được gửi thành công!",
            data: populatedReview
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ===================================================
// OWNER ROUTES (yêu cầu role = 'owner')
// ===================================================

// GET /api/properties/my-listings — Lấy danh sách tin của owner
export const getMyListings = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const { listingStatus } = req.query;

        let query = { owner: ownerId };
        if (listingStatus && listingStatus !== 'all') {
            query.listingStatus = listingStatus;
        }

        const properties = await Property.find(query)
            .sort({ createdAt: -1 })
            .lean();

        // Đếm booking requests cho từng property
        const Booking = (await import('../models/Booking.js')).default;
        const propertiesWithStats = await Promise.all(properties.map(async (p) => {
            const pendingBookings = await Booking.countDocuments({ 
                property: p._id, 
                status: 'pending' 
            });
            return { ...p, pendingBookings };
        }));

        res.status(200).json({
            success: true,
            count: propertiesWithStats.length,
            data: propertiesWithStats
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/properties — Tạo tin đăng mới
export const createProperty = async (req, res) => {
    try {
        const ownerId = req.user._id;
        
        // Log dữ liệu đầu vào để debug
        console.log("Create Property Request Body:", JSON.stringify(req.body, null, 2));

        // Lấy URLs ảnh đã upload lên Cloudinary
        const imageUrls = req.files ? req.files.map(f => f.path) : [];

        if (imageUrls.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng tải lên ít nhất 3 ảnh.' 
            });
        }

        // Trích xuất dữ liệu từ req.body (Xử lý cả flat keys và nested objects)
        const rb = req.body;
        const title = rb.title;
        const description = rb.description;
        const price = rb.price;
        const category = rb.category;
        const propertyType = rb.propertyType;
        const area = rb.area;
        const bedroom = rb.bedroom;
        const bathroom = rb.bathroom;
        const floor = rb.floor;
        const minLease = rb.minLease;
        const capacity = rb.capacity;
        const security = rb.security;
        const legalDocs = rb.legalDocs;
        const amenities = rb.amenities;
        
        // Vị trí
        const address = rb['location.address'] || (rb.location && rb.location.address) || '';
        const city = rb['location.city'] || (rb.location && rb.location.city) || 'Vĩnh Long';
        const districtName = rb['location.district'] || (rb.location && rb.location.district) || '';
        const lat = rb['location.coordinates.lat'] || (rb.location && rb.location.coordinates && rb.location.coordinates.lat);
        const lng = rb['location.coordinates.lng'] || (rb.location && rb.location.coordinates && rb.location.coordinates.lng);

        // 1. Resolve Category
        let categoryId = category;
        const targetCategoryName = propertyType || category;
        if (targetCategoryName && (!categoryId || !categoryId.toString().match(/^[0-9a-fA-F]{24}$/))) {
            const catObj = await Category.findOne({ name: targetCategoryName });
            if (catObj) {
                categoryId = catObj._id;
            } else {
                const firstCat = await Category.findOne();
                categoryId = firstCat ? firstCat._id : null;
            }
        }

        // 2. Resolve District (Find or Create)
        let districtId = null;
        if (districtName) {
            let district = await District.findOne({ 
                name: districtName, 
                city: city 
            });
            
            if (!district) {
                district = await District.create({ 
                    name: districtName, 
                    city: city 
                });
            }
            districtId = district._id;
        }

        // 3. Resolve Amenities (Improved Parsing)
        let resolvedAmenities = [];
        if (amenities) {
            let amenityKeys = [];
            
            // Hàm helper để parse chuỗi có dạng "[ 'a', 'b' ]"
            const parseStrangeString = (str) => {
                if (typeof str === 'string' && str.startsWith('[') && str.endsWith(']')) {
                    try {
                        const cleanStr = str.replace(/'/g, '"');
                        return JSON.parse(cleanStr);
                    } catch (e) {
                        return null;
                    }
                }
                return null;
            };

            if (Array.isArray(amenities)) {
                // Trường hợp nhận được mảng: ['wifi'] hoặc ["[ 'wifi', 'gym' ]"]
                if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
                    amenityKeys = parseStrangeString(amenities[0]) || amenities;
                } else {
                    amenityKeys = amenities;
                }
            } else if (typeof amenities === 'string') {
                // Trường hợp nhận được chuỗi đơn: "wifi" hoặc "[ 'wifi', 'gym' ]"
                amenityKeys = parseStrangeString(amenities) || [amenities];
            }

            // Mapping frontend keys to DB names
            const keyToName = {
                'wifi': 'Wifi',
                'air_conditioner': 'Máy lạnh',
                'refrigerator': 'Tủ lạnh',
                'parking': 'Bãi đậu xe',
                'elevator': 'Thang máy',
                'gym': 'Phòng gym',
                'washing_machine': 'Máy giặt',
                'camera': 'Camera an ninh'
            };

            const dbNames = amenityKeys.map(k => keyToName[k] || k);
            const foundAmenities = await Amenity.find({ name: { $in: dbNames } });
            resolvedAmenities = foundAmenities.map(a => a._id);
        }

        const property = await Property.create({
            title,
            description,
            price: Number(price),
            category: categoryId,
            area: Number(area),
            bedroom: Number(bedroom) || 1,
            bathroom: Number(bathroom) || 1,
            floor: Number(floor) || 1,
            minLease,
            capacity: Number(capacity) || 1,
            security,
            legalDocs,
            amenities: resolvedAmenities,
            images: imageUrls,
            location: {
                address: address,
                city: city,
                district: districtId,
                coordinates: { 
                    lat: lat ? Number(lat) : 10.2533, 
                    lng: lng ? Number(lng) : 105.9722 
                }
            },
            owner: ownerId,
        });

        res.status(201).json({
            success: true,
            message: 'Tin đăng đã được tạo thành công!',
            data: property
        });

    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/properties/:id — Cập nhật tin đăng
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findOne({ 
            _id: req.params.id, 
            owner: req.user._id 
        });

        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy tin đăng hoặc bạn không có quyền chỉnh sửa.' 
            });
        }

        // Nếu có upload ảnh mới
        let imageUrls = property.images;
        if (req.files && req.files.length > 0) {
            // Xóa ảnh cũ trên Cloudinary
            const deletePromises = property.images.map(url => {
                const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                return cloudinary.uploader.destroy(publicId);
            });
            await Promise.allSettled(deletePromises);
            imageUrls = req.files.map(f => f.path);
        }

        const updateData = { ...req.body, images: imageUrls };

        // Xử lý nested location object
        if (req.body['location.address'] || req.body['location.city']) {
            updateData.location = {
                address: req.body['location.address'] || property.location.address,
                city: req.body['location.city'] || property.location.city,
                district: req.body['location.district'] || property.location.district,
                coordinates: property.location.coordinates
            };
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Cập nhật tin đăng thành công!',
            data: updatedProperty
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/properties/:id — Xóa tin đăng (soft delete)
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findOne({ 
            _id: req.params.id, 
            owner: req.user._id 
        });

        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy tin đăng hoặc bạn không có quyền xóa.' 
            });
        }

        // Soft delete: ẩn tin thay vì xóa hoàn toàn
        property.listingStatus = 'hidden';
        await property.save();

        res.status(200).json({ 
            success: true, 
            message: 'Tin đăng đã được xóa.' 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/properties/:id/status — Thay đổi trạng thái (ẩn/hiện)
export const toggleListingStatus = async (req, res) => {
    try {
        const { listingStatus } = req.body;
        
        if (!['active', 'hidden'].includes(listingStatus)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Trạng thái không hợp lệ.' 
            });
        }

        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { listingStatus },
            { returnDocument: 'after' }
        );

        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy tin đăng.' 
            });
        }

        res.status(200).json({
            success: true,
            message: `Tin đăng đã được ${listingStatus === 'active' ? 'hiển thị' : 'ẩn'}.`,
            data: property
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};