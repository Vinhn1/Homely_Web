import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    icon: {
        type: String, // Tên icon hiển thị ở giao diện
        default: "CheckCircle"
    },
    category: {
        type: String,
        enum: ["Nội thất", "Tiện ích chung", "An ninh", "Khu vực xung quanh"],
        default: "Nội thất"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Amenity = mongoose.model("Amenity", amenitySchema);
export default Amenity;
