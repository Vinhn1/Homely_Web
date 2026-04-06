import Property from "../models/Property.js";

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

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

// Lấy chi tiết 1 căn hộ
export const getPropertyById = async (req, res) => {
    try{

        const property = await Property.findById(req.params.id).populate("owner", "displayName avatarUrl bio phone");

        if(!property){
            return res.status(404).json({success: false, message: "Không tìm thấy căn hộ"});
        }

        res.status(200).json({success: true, data: property});

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}