<div align="center">

# 🏡 Homely

**Nền tảng tìm kiếm và cho thuê phòng trọ thông minh tại Việt Nam**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)

[**Demo**](#) · [**API Docs**](#api-endpoints) · [**Báo lỗi**](#)

</div>

---

## 📖 Giới thiệu

**Homely** là ứng dụng web fullstack cho phép người dùng tìm kiếm, đăng tin và quản lý phòng trọ/căn hộ cho thuê. Dự án được xây dựng theo kiến trúc MERN Stack kết hợp với hệ thống real-time chat và thông báo tức thì thông qua Socket.IO.

### 🎯 Vấn Đề Giải Quyết

> Thị trường cho thuê phòng tại Việt Nam hiện nay thiếu một nền tảng đầy đủ tính năng, minh bạch về thông tin và có hệ thống quản lý chuyên nghiệp dành cho cả người thuê lẫn chủ nhà.

**Homely** giải quyết vấn đề đó bằng cách:
- 🔍 **Tìm kiếm thông minh** với bản đồ tương tác và nhiều bộ lọc
- 💬 **Chat trực tiếp** giữa người thuê và chủ nhà
- 📋 **Quản lý đặt phòng** minh bạch với flow rõ ràng
- 🛡️ **Hệ thống kiểm duyệt** bởi Admin để đảm bảo chất lượng

---

## ✨ Tính Năng Nổi Bật

<table>
<tr>
<td width="50%">

### 👤 Người Thuê (Tenant)
- 🔎 Tìm kiếm & lọc theo vị trí, giá, loại phòng
- 🗺️ Xem vị trí phòng trên bản đồ tương tác (Leaflet)
- 📄 Xem chi tiết phòng với gallery ảnh, tiện ích
- ❤️ Lưu phòng yêu thích
- 📅 Gửi yêu cầu đặt phòng
- ⭐ Đánh giá và nhận xét phòng
- 💬 Chat trực tiếp với chủ nhà
- 🔔 Nhận thông báo real-time

</td>
<td width="50%">

### 🏠 Chủ Nhà (Owner)
- ➕ Đăng tin với upload đa ảnh lên Cloudinary
- ✏️ Chỉnh sửa thông tin và ảnh bài đăng
- 👁️ Ẩn/hiện bài đăng linh hoạt
- 📊 Theo dõi lượt xem & booking requests
- ✅ Duyệt hoặc từ chối yêu cầu đặt phòng
- 💬 Nhắn tin với khách hàng
- 📈 Dashboard quản lý tổng quan

</td>
</tr>
<tr>
<td width="50%">

### 👑 Quản Trị Viên (Admin)
- 📊 Thống kê tổng quan hệ thống
- 👥 Duyệt yêu cầu trở thành chủ nhà
- 🔒 Khóa / mở khóa tài khoản vi phạm
- ✅ Xác thực (verify) bài đăng
- 🚩 Xử lý báo cáo vi phạm
- 🗑️ Kiểm duyệt và gỡ bài đăng không phù hợp

</td>
<td width="50%">

### ⚡ Tính Năng Kỹ Thuật
- 🔐 JWT Authentication + Role-based Authorization
- 📡 Real-time với Socket.IO (multi-device support)
- ☁️ Upload ảnh lên Cloudinary CDN
- ✅ Validation với Zod trên cả FE & BE
- 🗑️ Soft delete (bảo toàn data integrity)
- 🌐 Responsive design (Mobile-first)
- 🎬 Smooth animations với Framer Motion

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **React** | 19 | UI Library |
| **Vite** | 8 | Build tool & Dev server |
| **React Router** | v7 | Client-side routing |
| **Zustand** | 5 | Global state management |
| **TanStack Query** | 5 | Server state & caching |
| **Tailwind CSS** | 3 | Utility-first styling |
| **Framer Motion** | 12 | Animations & transitions |
| **Leaflet** | 1.9 | Interactive maps |
| **Socket.IO Client** | 4 | Real-time communication |
| **React Hook Form** | 7 | Form management |
| **Zod** | 4 | Schema validation |
| **Axios** | 1 | HTTP client |
| **Shadcn/UI** | - | Accessible UI components |
| **Lucide React** | - | Icon library |
| **date-fns** | 4 | Date formatting (locale vi) |
| **Sonner** | 2 | Toast notifications |

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Node.js** | - | Runtime |
| **Express** | 5 | Web framework |
| **MongoDB** | - | NoSQL Database |
| **Mongoose** | 9 | ODM (Object Document Mapper) |
| **Socket.IO** | 4 | Real-time WebSocket server |
| **JSON Web Token** | 9 | Authentication |
| **bcryptjs** | 3 | Password hashing |
| **Multer** | 2 | Multipart form handling |
| **Cloudinary** | 2 | Cloud image storage |
| **Zod** | 4 | Request validation |
| **dotenv** | 17 | Environment variables |
| **cors** | 2 | Cross-Origin Resource Sharing |

---

## 🗂️ Cấu Trúc Dự Án

```
Homely/
│
├── 📁 backend/
│   ├── src/
│   │   ├── 📁 controllers/         # Business logic
│   │   │   ├── auth.controller.js      # Đăng ký, đăng nhập, getMe
│   │   │   ├── property.controller.js  # CRUD bài đăng
│   │   │   ├── booking.controller.js   # Quản lý đặt phòng
│   │   │   ├── chat.controller.js      # Conversation & messages
│   │   │   ├── notification.controller.js
│   │   │   ├── admin.controller.js     # Admin operations
│   │   │   └── user.controller.js      # Profile management
│   │   │
│   │   ├── 📁 models/              # MongoDB Schemas (12 models)
│   │   │   ├── User.js             # Role-based user model
│   │   │   ├── Property.js         # Listing với location, amenities
│   │   │   ├── Booking.js          # Đặt phòng requests
│   │   │   ├── Conversation.js     # Chat conversations
│   │   │   ├── Message.js          # Tin nhắn
│   │   │   ├── Notification.js     # System notifications
│   │   │   ├── Review.js           # Đánh giá phòng
│   │   │   ├── Report.js           # Vi phạm báo cáo
│   │   │   ├── Favorite.js         # Yêu thích
│   │   │   ├── Category.js         # Loại phòng
│   │   │   ├── Amenity.js          # Tiện ích
│   │   │   └── District.js         # Quận/huyện
│   │   │
│   │   ├── 📁 routes/              # API route definitions (8 files)
│   │   ├── 📁 middlewares/         # auth, role, upload middleware
│   │   ├── 📁 validations/         # Zod schemas
│   │   ├── 📁 utils/               # socketManager.js
│   │   └── app.js                  # Express + Socket.IO setup
│   │
│   ├── 📁 scripts/                 # Seed scripts (faker.js data)
│   └── server.js
│
└── 📁 frontend/
    ├── src/
    │   ├── 📁 pages/
    │   │   ├── HomePage.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── PropertyDetailPage.jsx  # Full-featured detail page
    │   │   ├── AreasPage.jsx           # Browse by area
    │   │   ├── BlogPage.jsx
    │   │   ├── FavoritesPage.jsx
    │   │   ├── MyBookingsPage.jsx
    │   │   └── 📁 dashboard/
    │   │       ├── 📁 admin/           # 4 admin pages
    │   │       ├── 📁 owner/           # 3 owner pages
    │   │       └── 📁 shared/          # Profile, Messages, Notifications
    │   │
    │   ├── 📁 components/          # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PropertyCard.jsx
    │   │   ├── PropertyMap.jsx     # Leaflet map component
    │   │   ├── SearchBar.jsx
    │   │   ├── NotificationBell.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── OwnerRoute.jsx
    │   │   └── AdminRoute.jsx
    │   │
    │   ├── 📁 store/               # Zustand stores (5)
    │   │   ├── authStore.js        # Auth state + user info
    │   │   ├── propertyStore.js    # Properties list + selected
    │   │   ├── bookingStore.js     # Booking operations
    │   │   ├── chatStore.js        # Conversations + messages
    │   │   └── notificationStore.js
    │   │
    │   ├── 📁 hooks/
    │   │   └── useSocket.js        # Socket.IO connection hook
    │   │
    │   ├── 📁 layouts/
    │   │   ├── DashboardLayout.jsx
    │   │   └── AdminLayout.jsx
    │   │
    │   └── App.jsx                 # Routes definition
    └── index.html
```

---

## 🗺️ Route Map

### Public Routes
| Path | Component | Mô tả |
|---|---|---|
| `/` | HomePage | Landing page |
| `/search` | SearchPage | Tìm kiếm + lọc |
| `/areas` | AreasPage | Khám phá theo khu vực |
| `/blog` | BlogPage | Bài viết tư vấn |
| `/signin` | SignInPage | Đăng nhập |
| `/signup` | SignUpPage | Đăng ký |

### Protected Routes (yêu cầu đăng nhập)
| Path | Component | Mô tả |
|---|---|---|
| `/property/:id` | PropertyDetailPage | Chi tiết phòng |
| `/favorites` | FavoritesPage | Phòng yêu thích |
| `/my-bookings` | MyBookingsPage | Đơn đặt phòng |
| `/dashboard/profile` | ProfilePage | Hồ sơ cá nhân |
| `/dashboard/messages` | MessagesPage | Tin nhắn |
| `/dashboard/notifications` | NotificationsPage | Thông báo |

### Owner Routes (yêu cầu role = owner)
| Path | Component | Mô tả |
|---|---|---|
| `/dashboard/my-listings` | MyListingsPage | Quản lý bài đăng |
| `/dashboard/post-property` | PostPropertyPage | Đăng tin mới |
| `/dashboard/edit-property/:id` | PostPropertyPage | Chỉnh sửa tin |
| `/dashboard/booking-requests` | BookingRequestsPage | Yêu cầu đặt phòng |

### Admin Routes (yêu cầu role = admin)
| Path | Component | Mô tả |
|---|---|---|
| `/admin` | AdminOverviewPage | Tổng quan thống kê |
| `/admin/users` | AdminUsersPage | Quản lý người dùng |
| `/admin/listings` | AdminListingsPage | Kiểm duyệt bài đăng |
| `/admin/reports` | AdminReportsPage | Xử lý báo cáo |

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
```
POST   /signup              Đăng ký tài khoản
POST   /signin              Đăng nhập
GET    /me                  Lấy thông tin user hiện tại
POST   /request-owner       Yêu cầu trở thành chủ nhà
```

### Properties (`/api/properties`)
```
GET    /                    Danh sách + tìm kiếm + lọc
GET    /:id                 Chi tiết 1 phòng (tăng viewCount)
POST   /:id/reviews         Thêm đánh giá
GET    /my-listings         [Owner] Bài đăng của mình
POST   /                    [Owner] Tạo bài đăng mới
PUT    /:id                 [Owner] Cập nhật bài đăng
DELETE /:id                 [Owner] Xóa bài đăng (soft delete)
PATCH  /:id/status          [Owner] Ẩn/hiện bài đăng
```

### Bookings (`/api/bookings`)
```
POST   /                    Tạo yêu cầu đặt phòng
GET    /my-bookings         Đặt phòng của tenant
GET    /requests            [Owner] Yêu cầu đặt phòng
PATCH  /:id/status          [Owner] Duyệt/từ chối
```

### Chat (`/api/chat`)
```
POST   /conversations       Tạo hoặc lấy conversation
GET    /conversations       Danh sách conversations
GET    /conversations/:id/messages  Lịch sử tin nhắn
POST   /conversations/:id/messages  Gửi tin nhắn
```

### Notifications (`/api/notifications`)
```
GET    /                    Danh sách thông báo
PATCH  /:id/read            Đánh dấu đã đọc
PATCH  /read-all            Đánh dấu tất cả đã đọc
```

### Admin (`/api/admin`)
```
GET    /stats               Thống kê tổng quan
GET    /users               Danh sách users (có filter)
PATCH  /users/:id/approve-owner   Duyệt chủ nhà
PATCH  /users/:id/reject-owner    Từ chối chủ nhà
PATCH  /users/:id/ban       Khóa tài khoản
PATCH  /users/:id/unban     Mở khóa tài khoản
GET    /listings            Danh sách bài đăng (admin view)
PATCH  /listings/:id/verify Xác thực bài đăng
PATCH  /listings/:id/hide   Ẩn bài đăng
DELETE /listings/:id        Xóa bài đăng
GET    /reports             Danh sách báo cáo
PATCH  /reports/:id/resolve Giải quyết báo cáo
PATCH  /reports/:id/dismiss Bỏ qua báo cáo
```

---

## 📡 Real-time Events (Socket.IO)

| Event | Hướng | Mô tả |
|---|---|---|
| `connection` | Client → Server | Kết nối với userId |
| `disconnect` | Client → Server | Ngắt kết nối |
| `new_notification` | Server → Client | Thông báo mới |
| `receive_message` | Server → Client | Tin nhắn mới |

---

## ⚙️ Cài Đặt & Chạy Project

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc MongoDB Atlas)
- Tài khoản Cloudinary (miễn phí)

### 1. Clone repository
```bash
git clone https://github.com/yourusername/homely.git
cd homely
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homely
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Cài đặt Frontend
```bash
cd ../frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Seed Database (Tùy chọn)
```bash
cd backend
# Tạo tài khoản admin
node scripts/create_admin.js

# Seed dữ liệu phòng cho Vĩnh Long
node scripts/seed_vinhlong.js
```

### 5. Chạy ứng dụng

Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Server chạy tại http://localhost:5000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# App chạy tại http://localhost:5173
```

---

## 🔑 Tài Khoản Demo

| Role | Email | Password |
|---|---|---|
| Admin | admin@homely.vn | Admin@123 |
| Owner | owner@homely.vn | Owner@123 |
| Tenant | user@homely.vn | User@123 |

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Zustand │  │  Axios   │  │ Socket.IO│              │
│  │  Stores  │  │  HTTP    │  │  Client  │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
└───────┼─────────────┼─────────────┼─────────────────────┘
        │             │             │
        │      REST API│             │ WebSocket
        │             ▼             ▼
┌───────────────────────────────────────────────────────┐
│                  SERVER (Express + Socket.IO)          │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐ │
│  │  Middleware │  │ Controllers │  │ socketManager │ │
│  │auth│role│up│  │ Business    │  │ userSocketMap │ │
│  │load         │  │ Logic       │  │ (Multi-device)│ │
│  └─────────────┘  └──────┬──────┘  └───────────────┘ │
└──────────────────────────┼────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│                     MongoDB                           │
│  Users │ Properties │ Bookings │ Messages │ ...       │
└───────────────────────────────────────────────────────┘
         
                           +
                           
┌───────────────────────────────────────────────────────┐
│                   Cloudinary CDN                      │
│              Image Storage & Optimization             │
└───────────────────────────────────────────────────────┘
```

---

## 🎨 Design System

- **Font**: Geist Variable (`@fontsource-variable/geist`)
- **Color Palette**: Slate (neutral) + Blue (primary) + Emerald/Amber (accent)
- **Border Radius**: Rounded-2xl to rounded-[40px] (premium feel)
- **Animation Library**: Framer Motion với AnimatePresence
- **Dark Mode**: Admin dashboard (dark), Public pages (light)
- **Responsive**: Mobile-first, breakpoints: `sm`, `md`, `lg`, `xl`

---

## 📈 Sơ Đồ Database

```
User ──────────────── Property
 │                       │
 │                    Category
 │                    Amenities
 │                    District
 │                       │
 ├── Booking ────────────┤
 │                       │
 ├── Review ─────────────┤
 │                       │
 ├── Favorite ───────────┤
 │                       │
 ├── Report ─────────────┤
 │
 └── Conversation ── Message
```

---

## 🤝 Đóng Góp

Pull requests are welcome! Với các thay đổi lớn, vui lòng mở issue trước để thảo luận.

1. Fork project
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Được xây dựng với ❤️ bởi [Your Name]**

*Nếu project này hữu ích, hãy để lại ⭐ trên GitHub!*

</div>
