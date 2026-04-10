import mongoose from "mongoose";
import dotenv from 'dotenv';
import {faker} from '@faker-js/faker';
import Property from "../src/models/Property.js";
import User from "../src/models/User.js";

dotenv.config();

const AMENITIES_LIST = ["Wifi", "Điều hòa", "Thang máy", "Nhà bếp", "An ninh", "Tủ lạnh", "Hồ bơi", "Máy giặt", "Gác lửng"];
const PROPERTY_TYPES = ["Căn hộ", "Phòng trọ", "Nhà nguyên căn", "Chung cư"];

const seedData = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Đang kết nối Database...");
        // Lấy tất cả User để phân phối ngẫu nhiên cho các căn hộ 
        const users = await User.find();
        if(users.length === 0){
            console.log("Lỗi: Cần có ít nhất 1 User trong DB. Hãy đăng ký tài khoản trước!");
            process.exit(1);
        }

        // Xóa dữ liệu cữ để làm sạch
        await Property.deleteMany({});
        console.log("Đã dọn dẹp dữ liệu cũ...");

        const properties = [];

        // Vòng lặp tạo 20 dữ liệu
        for (let i = 0; i < 20; i++){
            const randomUser = users[Math.floor(Math.random() * users.length)];

            properties.push({
                title: `${faker.commerce.productAdjective()} Studio in ${faker.location.city()}`,
                description: faker.commerce.productDescription(),
                price: Math.floor(Math.random() * (15000000 - 2000000 + 1)) + 2000000, // giá từ 2tr - 15tr
                propertyType: PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)],
                status: "Còn phòng",
                isVerified: faker.datatype.boolean(),
                isPopular: faker.datatype.boolean(),
                area: Math.floor(Math.random() * (100 - 20 + 1)) + 20, // 20m2 - 100m2
                amenities: faker.helpers.arrayElements(AMENITIES_LIST, { min: 3, max: 6 }), // Chọn ngẫu nhiên 3-6 tiện ích
                images: ["https://res.cloudinary.com/demo/image/upload/v1652343547/sample.jpg"], // Dùng ảnh mẫu
                location: 
                {
                    address: faker.location.streetAddress(),
                    city: "Hồ Chí Minh",
                    district: "Quận " + (Math.floor(Math.random() * 12) + 1),
                    coordinates: {
                        // Tọa độ xung quanh TP.HCM (Kinh độ 10.7, Vĩ độ 106.6)
                        lat: 10.7 + (Math.random() * 0.1),
                        lng: 106.6 + (Math.random() * 0.1)
                    }
                 },
                owner: randomUser._id,
                rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // Rating từ 3.0 - 5.0
                reviewCount: Math.floor(Math.random() * 50)
            });
        }

        await Property.insertMany(properties);
        console.log(`Thành công! Đã tạo ${properties.length} căn hộ mẫu với dữ liệu ngẫu nhiên.`);
        process.exit();
    }catch(error){
        console.error("❌ Lỗi Seed:", error);
        process.exit(1);
    }
};

seedData();