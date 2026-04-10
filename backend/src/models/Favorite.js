import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    }
}, {
    timestamps: true
});

// Đảm bảo mỗi người dùng chỉ yêu thích 1 bài đăng 1 lần
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
