import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import User from '../models/User.js';
import Property from '../models/Property.js';
import Category from '../models/Category.js';
import Amenity from '../models/Amenity.js';
import District from '../models/District.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const CATEGORIES = [
    { name: "Phòng trọ", icon: "Home", description: "Không gian sống tiết kiệm cho sinh viên và người lao động." },
    { name: "Căn hộ", icon: "Building", description: "Căn hộ dịch vụ đầy đủ tiện nghi." },
    { name: "Nhà nguyên căn", icon: "Warehouse", description: "Phù hợp cho gia đình hoặc nhóm bạn." },
    { name: "Chung cư", icon: "Layout", description: "Căn hộ cao cấp tại các tòa nhà." }
];

const AMENITIES = [
    { name: "Wifi", icon: "Wifi", category: "Tiện ích chung" },
    { name: "Máy lạnh", icon: "AirVent", category: "Nội thất" },
    { name: "Bãi đậu xe", icon: "ParkingCircle", category: "Tiện ích chung" },
    { name: "Tủ lạnh", icon: "Refrigerator", category: "Nội thất" },
    { name: "Máy giặt", icon: "WashingMachine", category: "Tiện ích chung" },
    { name: "Camera an ninh", icon: "Camera", category: "An ninh" },
    { name: "Thang máy", icon: "ArrowUpCircle", category: "Tiện ích chung" },
    { name: "Phòng gym", icon: "Dumbbell", category: "Khu vực xung quanh" }
];

const DISTRICTS = [
    { name: "Phường 1", city: "Vĩnh Long" },
    { name: "Phường 2", city: "Vĩnh Long" },
    { name: "Phường 3", city: "Vĩnh Long" },
    { name: "Phường 4", city: "Vĩnh Long" },
    { name: "Phường 8", city: "Vĩnh Long" },
    { name: "Huyện Long Hồ", city: "Vĩnh Long" }
];

const PROPERTY_DATA = [
    {
        title: "Nhà Trọ Sinh Viên Thanh Thảo - Gần ĐH SPKT Vĩnh Long",
        description: "Phòng trọ mới xây, có gác lửng, sạch sẽ, an ninh. Gần trường Đại học Sư phạm Kỹ thuật, thuận tiện đi lại, giờ giấc tự do.",
        price: 1200000,
        categoryName: "Phòng trọ",
        area: 20,
        address: "67/2 Phó Cơ Điều, Phường 3",
        districtName: "Phường 3",
        lat: 10.2323, lng: 105.9522,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800"
        ],
        amenityNames: ["Wifi", "Bãi đậu xe", "Camera an ninh"]
    },
    {
        title: "Căn Hộ Mini Full Nội Thất - Phường 2 Trung Tâm",
        description: "Căn hộ dịch vụ đầy đủ tiện nghi: máy lạnh, tủ lạnh, giường nệm. Chỉ xách vali vào ở. Ngay trung tâm thành phố, gần chợ Vĩnh Long.",
        price: 3500000,
        categoryName: "Căn hộ",
        area: 35,
        address: "Đường Mậu Thân, Phường 2",
        districtName: "Phường 2",
        lat: 10.2533, lng: 105.9722,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
        ],
        amenityNames: ["Wifi", "Máy lạnh", "Tủ lạnh", "Bãi đậu xe", "Máy giặt"]
    },
    {
        title: "Nhà Nguyên Căn Phường 8 - Yên Tĩnh, Thoáng Mát",
        description: "Nhà 1 trệt 1 lầu, 2 phòng ngủ, sân vườn rộng. Thích hợp cho hộ gia đình hoặc nhóm bạn thuê ở chung lâu dài.",
        price: 5500000,
        categoryName: "Nhà nguyên căn",
        area: 85,
        address: "Đường Võ Văn Kiệt, Phường 8",
        districtName: "Phường 8",
        lat: 10.2450, lng: 105.9600,
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"
        ],
        amenityNames: ["Wifi", "Bãi đậu xe", "Camera an ninh"]
    },
    {
        title: "Phòng Trọ Giá Rẻ Hòa Phú - Sát Khu Công Nghiệp",
        description: "Giá cực rẻ cho công nhân, khu vực yên tĩnh, lối đi riêng, không chung chủ. Điện nước giá nhà nước.",
        price: 850000,
        categoryName: "Phòng trọ",
        area: 18,
        address: "Xã Hòa Phú, Huyện Long Hồ",
        districtName: "Huyện Long Hồ",
        lat: 10.1850, lng: 105.9400,
        images: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&q=80&w=800"
        ],
        amenityNames: ["Bãi đậu xe"]
    },
    {
        title: "Chung Cư Cao Cấp - Tầm Nhìn Sông Cổ Chiên",
        description: "Căn hộ cao cấp tầng 12, view sông cực đẹp. Nội thất hiện đại, có hồ bơi và phòng gym trong tòa nhà.",
        price: 7500000,
        categoryName: "Chung cư",
        area: 65,
        address: "Phường 1, TP. Vĩnh Long",
        districtName: "Phường 1",
        lat: 10.2580, lng: 105.9750,
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1493236272120-200db0da1927?auto=format&fit=crop&q=80&w=800"
        ],
        amenityNames: ["Wifi", "Máy lạnh", "Tủ lạnh", "Thang máy", "Phòng gym", "Camera an ninh"]
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        // Clear existing data (Be careful!)
        await Property.deleteMany({});
        await Category.deleteMany({});
        await Amenity.deleteMany({});
        await District.deleteMany({});
        console.log('Cleared existing properties, categories, amenities, and districts.');

        // Seed Categories
        const createdCategories = await Category.insertMany(CATEGORIES);
        console.log(`Created ${createdCategories.length} categories.`);

        // Seed Amenities
        const createdAmenities = await Amenity.insertMany(AMENITIES);
        console.log(`Created ${createdAmenities.length} amenities.`);

        // Seed Districts
        const createdDistricts = await District.insertMany(DISTRICTS);
        console.log(`Created ${createdDistricts.length} districts.`);

        // Find an owner
        const owner = await User.findOne({ role: 'owner' });
        if (!owner) {
            console.error('Error: No user found with role "owner". Please create an owner first.');
            process.exit(1);
        }

        // Prepare Properties
        const properties = PROPERTY_DATA.map(data => {
            const categoryObj = createdCategories.find(c => c.name === data.categoryName);
            const districtObj = createdDistricts.find(d => d.name === data.districtName);
            const amenityIds = createdAmenities
                .filter(a => data.amenityNames.includes(a.name))
                .map(a => a._id);

            return {
                title: data.title,
                description: data.description,
                price: data.price,
                category: categoryObj?._id,
                area: data.area,
                bedroom: data.categoryName === 'Nhà nguyên căn' ? 2 : 1,
                bathroom: 1,
                floor: 1,
                images: data.images,
                location: {
                    address: data.address,
                    city: "Vĩnh Long",
                    district: districtObj?._id,
                    coordinates: { lat: data.lat, lng: data.lng }
                },
                amenities: amenityIds,
                owner: owner._id,
                listingStatus: 'active',
                viewCount: Math.floor(Math.random() * 100)
            };
        });

        await Property.insertMany(properties);
        console.log(`Successfully seeded ${properties.length} relational properties!`);
        
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
