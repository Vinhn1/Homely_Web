import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String, // Có thể lưu tên icon từ lucide-react hoặc font-awesome
        default: "Home"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
