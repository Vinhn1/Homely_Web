import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        default: "Vĩnh Long",
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Mỗi thành phố không nên có 2 quận trùng tên
districtSchema.index({ name: 1, city: 1 }, { unique: true });

const District = mongoose.model("District", districtSchema);
export default District;
