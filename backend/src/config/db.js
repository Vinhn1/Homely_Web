// Kết nối db MongoDB 
import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Kết nối CSDL thành công!");
    }catch(error){
        console.log("Lỗi khi kết nối CSDL", error);
        // "Thất bại" (Uncaught Fatal Exception): báo hiệu rằng đã 
        //  có một lỗi nghiêm trọng xảy ra mà chương trình không thể tự xử lý được và buộc phải dừng lại.
        process.exit(1);
    }
}