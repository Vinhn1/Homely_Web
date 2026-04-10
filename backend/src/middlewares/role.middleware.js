// Kiểm tra role middleware
// Dùng sau 'protect' để phân quyền theo role

// Chỉ cho phép owner
export const requireOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Quyền truy cập bị từ chối. Chỉ dành cho Chủ nhà.' 
    });
};

// Chỉ cho phép admin
export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Quyền truy cập bị từ chối. Chỉ dành cho Admin.' 
    });
};
