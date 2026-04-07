import Property from "../models/Property.js";
import Review from "../models/Review.js";

// Lấy danh sách + Tìm kiếm + Lọc
export const getProperties = async (req, res) => {
    try{

        const { city, district, propertyType, minPrice, maxPrice, search } = req.query;

        // Khởi tạo đối tượng truy vấn (Filter obj)
        let query = {};

        // Nếu người dùng chọn Thành phố/Quận, ta thêm vào query
        if(city) query["location.city"] = city;
        if(district) query["location.district"] = district;
        if(propertyType) query.propertyType = propertyType;

        // Logic lọc theo khoảng giá
        if(minPrice || maxPrice){
            query.price = {};
           // $gte: Greater than or equal (Lớn hơn hoặc bằng)
           if(minPrice) query.price.$gte = Number(minPrice);
           // $lte: Less than or equal (Nhỏ hơn hoặc bằng)
           if(maxPrice) query.price.$lte = Number(maxPrice);

        }

        // Logic: Tìm kiếm theo từ khóa (Tiêu đề hoặc Mô tả)
        if(search){
            query.$or = [{
                title: {
                    $regex: search,
                    $options: "i" 
                }
            }];
        }

        // Thực thi truy vấn và "Kéo" (populate) thông tin chủ nhà
        // Chỉ lấy tên và ảnh của chủ nhà
        // Mới nhất hiện lên đầu
        const properties = await Property.find(query).populate("owner", "displayName avatarUrl").sort({createdAt: -1});

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Thêm đánh giá mới
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const propertyId = req.params.id;
        const userId = req.user._id;

        // 1. Kiểm tra property tồn tại
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Không tìm thấy căn hộ để đánh giá." });
        }

        // 2. Tạo review mới
        const review = await Review.create({
            property: propertyId,
            user: userId,
            rating: Number(rating),
            comment
        });

        // 3. Tính toán lại rating trung bình và reviewCount cho Property
        const allReviews = await Review.find({ property: propertyId });
        const reviewCount = allReviews.length;
        const averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount;

        property.rating = Number(averageRating.toFixed(1));
        property.reviewCount = reviewCount;
        await property.save();

        // 4. Trả về review vừa tạo (kèm thông tin user để hiển thị ngay)
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

// Lấy chi tiết 1 căn hộ
export const getPropertyById = async (req, res) => {
    try{

        const property = await Property.findById(req.params.id)
            .populate("owner", "displayName avatarUrl bio phone");
        
        // Lấy danh sách reviews mới nhất
        const reviews = await Review.find({ property: req.params.id })
            .populate("user", "displayName avatarUrl")
            .sort({ createdAt: -1 });

        if(!property){
            return res.status(404).json({success: false, message: "Không tìm thấy căn hộ"});
        }

        res.status(200).json({
            success: true, 
            data: {
                ...property._doc,
                reviews: reviews
            }
        });

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}