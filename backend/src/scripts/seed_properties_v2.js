import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';
import District from '../models/District.js';
import Category from '../models/Category.js';
import Amenity from '../models/Amenity.js';

dotenv.config({ path: 'backend/.env' });

const OWNER_ID = '69d5fecc9829bf2068a59591'; // Nguyễn Chí Vinh (vinhn27045@gmail.com)

const seedProperties = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const districts = await District.find({ isActive: true });
        const categories = await Category.find({ isActive: true });
        const amenities = await Amenity.find({ isActive: true });

        if (districts.length === 0 || categories.length === 0) {
            console.error('Missing districts or categories. Please seed them first.');
            process.exit(1);
        }

        const hcmDistricts = districts.filter(d => d.city === 'Hồ Chí Minh');
        const vlDistricts = districts.filter(d => d.city === 'Vĩnh Long');

        const images = [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&q=80&w=800',
        ];

        const properties = [];

        // Generate 100 properties
        for (let i = 0; i < 100; i++) {
            const isHCM = i < 60; // 60 in HCM, 40 in VL
            const cityDistricts = isHCM ? hcmDistricts : vlDistricts;
            const district = cityDistricts[Math.floor(Math.random() * cityDistricts.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            // Random amenities (3-6 items)
            const randomAmenities = amenities
                .sort(() => 0.5 - Math.random())
                .slice(0, 3 + Math.floor(Math.random() * 4))
                .map(a => a._id);

            // Coordinates
            let lat, lng;
            if (isHCM) {
                lat = 10.75 + (Math.random() - 0.5) * 0.15;
                lng = 106.65 + (Math.random() - 0.5) * 0.15;
            } else {
                lat = 10.25 + (Math.random() - 0.5) * 0.05;
                lng = 105.97 + (Math.random() - 0.5) * 0.05;
            }

            const price = 1500000 + Math.floor(Math.random() * 13500000);
            const area = 20 + Math.floor(Math.random() * 80);

            properties.push({
                title: `${category.name} ${district.name} - Giá Tốt ${i + 1}`,
                description: `Một lựa chọn tuyệt vời tại ${district.name}, ${district.city}. Không gian thoáng mát, sạch sẽ, đầy đủ tiện nghi, an ninh đảm bảo 24/7. Phù hợp cho sinh viên và người đi làm.`,
                price: price,
                category: category._id,
                status: 'Còn phòng',
                listingStatus: 'active',
                isVerified: Math.random() > 0.7,
                isPopular: Math.random() > 0.8,
                isPromoted: Math.random() > 0.9,
                area: area,
                bedroom: 1 + Math.floor(Math.random() * 2),
                bathroom: 1,
                floor: 1 + Math.floor(Math.random() * 5),
                minLease: '6 Tháng',
                capacity: 1 + Math.floor(Math.random() * 3),
                security: '24/7',
                legalDocs: 'Hợp đồng thuê',
                amenities: randomAmenities,
                images: images.sort(() => 0.5 - Math.random()).slice(0, 3),
                location: {
                    address: `Số ${Math.floor(Math.random() * 200)}/ ${Math.floor(Math.random() * 50)} Đường ${district.name}`,
                    district: district._id,
                    city: district.city,
                    coordinates: { lat, lng }
                },
                owner: OWNER_ID,
                viewCount: Math.floor(Math.random() * 500),
                rating: 0,
                reviewCount: 0,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        }

        await Property.insertMany(properties);
        console.log('100 properties seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding properties:', error);
        process.exit(1);
    }
};

seedProperties();
