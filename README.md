# Hệ Thống Quản Lý Ký Túc Xá — Frontend

Ứng dụng web quản lý ký túc xá dành cho sinh viên, được xây dựng bằng **React + Vite**. Đây là đồ án môn **SE100 — Phương pháp phát triển phần mềm hướng đối tượng**.

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng](#tính-năng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Biến môi trường](#biến-môi-trường)
- [Triển khai](#triển-khai)

---

## Giới thiệu

Hệ thống hỗ trợ ba vai trò người dùng:

| Vai trò | Mô tả |
|---|---|
| **Admin** | Quản trị toàn bộ hệ thống, quản lý người quản lý và tòa nhà, xem báo cáo tài chính |
| **Manager** | Quản lý tòa nhà được phân công: phòng, hợp đồng, tiện ích, bảo trì, vi phạm, hóa đơn |
| **Student** | Đăng ký phòng, xem hợp đồng, thanh toán, yêu cầu bảo trì, theo dõi tiện ích và bảo hiểm |

---

## Công nghệ sử dụng

| Thư viện / Framework | Phiên bản | Mục đích |
|---|---|---|
| [React](https://react.dev/) | 19 | Thư viện UI chính |
| [Vite](https://vitejs.dev/) | 7 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Styling |
| [React Router DOM](https://reactrouter.com/) | 7 | Điều hướng phía client |
| [Axios](https://axios-http.com/) | 1.x | Gọi REST API |
| [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr) | 10 | Thông báo real-time (SignalR) |
| [Recharts](https://recharts.org/) | 3 | Biểu đồ thống kê |
| [React Hook Form](https://react-hook-form.com/) | 7 | Quản lý form |
| [jwt-decode](https://github.com/auth0/jwt-decode) | 4 | Giải mã JWT |
| [date-fns](https://date-fns.org/) | 4 | Xử lý ngày tháng |
| [react-hot-toast](https://react-hot-toast.com/) | 2 | Thông báo toast |

---

## Tính năng

### Admin
- Dashboard tổng quan hệ thống (thống kê sinh viên, tòa nhà, doanh thu)
- Quản lý người quản lý (thêm, sửa, xóa)
- Quản lý tòa nhà & loại phòng (sức chứa, cấu hình)
- Xem báo cáo tài chính và thống kê qua biểu đồ
- Cấu hình hệ thống (bảo hiểm, tiện ích)

### Manager
- Dashboard quản lý tòa nhà được phân công
- Quản lý danh sách phòng và trạng thái phòng
- Quản lý hợp đồng thuê phòng
- Quản lý hóa đơn tiện ích
- Xử lý yêu cầu bảo trì
- Quản lý vi phạm nội quy

### Student
- Dashboard cá nhân
- Đăng ký / gia hạn hợp đồng thuê phòng
- Thanh toán trực tuyến (đăng ký, gia hạn, tiện ích, bảo hiểm, bảo trì)
- Tra cứu hóa đơn tiện ích & thực hiện thanh toán
- Gửi yêu cầu bảo trì
- Đăng ký bảo hiểm y tế sinh viên
- Xem lịch sử vi phạm
- Cập nhật hồ sơ cá nhân

### Chung
- Xác thực JWT với tự động làm mới access token (refresh token)
- Thông báo real-time qua **SignalR**
- Giao diện responsive (Tailwind CSS)

---

## Cấu trúc thư mục

```
src/
├── assets/             # Hình ảnh & file style tĩnh
├── components/
│   ├── features/
│   │   ├── admin/      # Các component dành riêng cho Admin
│   │   ├── manager/    # Các component dành riêng cho Manager
│   │   └── student/    # Các component dành riêng cho Student
│   ├── shared/         # Header, MenuTabs, StatCard, ... (dùng chung)
│   └── ui/             # Badge, Button, Input, Select (base components)
├── context/
│   └── AuthContext.jsx # Quản lý trạng thái đăng nhập toàn cục
├── hooks/
│   └── useNotificationSignalR.js  # Hook kết nối SignalR
├── layouts/
│   ├── AuthLayout.jsx  # Layout cho trang xác thực
│   └── MainLayout.jsx  # Layout chính (có header & menu)
├── pages/
│   ├── admin/          # Các trang Admin
│   ├── auth/           # Các trang đăng nhập / đăng ký / đặt lại mật khẩu
│   ├── manager/        # Các trang Manager
│   └── student/        # Các trang Student
├── services/           # Các module gọi API (Axios)
├── utils/
│   ├── constants.js    # Hằng số (roles, payment types, ...)
│   ├── format.js       # Hàm định dạng ngày, tiền tệ, ...
│   └── menuConfig.js   # Cấu hình menu theo vai trò
├── App.jsx             # Cấu hình routing chính
└── main.jsx            # Entry point
```

---

## Cài đặt & Chạy dự án

### Yêu cầu

- **Node.js** >= 18
- **npm** >= 9

### Các bước

```bash
# 1. Clone repository
git clone https://github.com/quangvinh263/dormitory-fe.git
cd dormitory-fe

# 2. Cài đặt dependencies
npm install

# 3. Tạo file biến môi trường
# Tạo file .env tại thư mục gốc (xem mục bên dưới)

# 4. Chạy ở chế độ development
npm run dev
```

Ứng dụng mặc định chạy tại `http://localhost:5173`.

### Các lệnh khác

```bash
npm run build    # Build production
npm run preview  # Xem trước bản build
npm run lint     # Kiểm tra lỗi ESLint
```

---

## Biến môi trường

Tạo file `.env` tại thư mục gốc với nội dung:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

> Biến bắt đầu bằng `VITE_` mới được Vite expose ra phía client.

---

## Triển khai

Dự án được cấu hình sẵn để deploy lên **Vercel**. File `vercel.json` đã thiết lập rewrite toàn bộ route về `index.html` để hỗ trợ React Router.

```bash
# Cài Vercel CLI (nếu chưa có)
npm i -g vercel

# Deploy
vercel
```
