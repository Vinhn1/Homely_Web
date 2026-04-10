import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Lấy thông tin cá nhân hiện tại
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-hashedPassword");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi lấy thông tin profile:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Cập nhật thông tin cá nhân + Upload Avatar
export const updateProfile = async (req, res) => {
  try {
    const { displayName, phone, bio } = req.body;
    const userId = req.user._id;

    // Chỉ cập nhật những trường có dữ liệu
    let updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;

    // Nếu có file ảnh được gửi lên
    if (req.file) {
      // Upload trực tiếp từ buffer lên Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "homely/avatars",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      updateData.avatarUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-hashedPassword");

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    res.status(500).json({ message: "Lỗi cập nhật hồ sơ" });
  }
};
