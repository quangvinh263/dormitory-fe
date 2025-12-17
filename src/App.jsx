import React from 'react';
import { 
  BellIcon, 
  ArrowRightStartOnRectangleIcon, // Icon Đăng xuất
  UserGroupIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans text-slate-800">
      
      {/* --- 1. HEADER (Thanh trên cùng) --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo & Tiêu đề */}
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Quản Trị Hệ Thống</h1>
                <p className="text-xs text-gray-500 font-medium">Xin chào, Quản Trị Viên</p>
              </div>
            </div>

            {/* Bên phải: Thông báo & Đăng xuất */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 cursor-pointer">
                <BellIcon className="h-6 w-6" />
                {/* Chấm đỏ thông báo */}
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger ring-2 ring-white text-[10px] font-bold text-white">
                  2
                </span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. NỘI DUNG CHÍNH --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Menu Tabs (Màu xám bo góc) */}
        <div className="bg-gray-100 p-1 rounded-xl w-full grid grid-cols-5 font-medium text-sm gap-1">
          <TabItem active>Tổng quan</TabItem>
          <TabItem>Trưởng tòa</TabItem>
          <TabItem>Báo cáo</TabItem>
          <TabItem>Nhật ký</TabItem>
          <TabItem>Cấu hình</TabItem>
        </div>

        {/* Thống kê (Grid 4 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Tổng sinh viên" 
            value="1,234" 
            subtext="+12% so với tháng trước" 
            icon={<UserGroupIcon className="w-6 h-6 text-gray-400" />}
          />
          <StatCard 
            title="Trưởng tòa" 
            value="8" 
            subtext="8 tòa nhà" 
            icon={<ShieldCheckIcon className="w-6 h-6 text-gray-400" />}
          />
          <StatCard 
            title="Tỷ lệ lấp đầy" 
            value="87%" 
            subtext="950/1,092 giường" 
            icon={<ChartBarIcon className="w-6 h-6 text-gray-400" />}
          />
          <StatCard 
            title="Vi phạm tháng này" 
            value="23" 
            isDanger // Đánh dấu màu đỏ
            subtext="+5 so với tháng trước" 
            icon={<ExclamationTriangleIcon className="w-6 h-6 text-gray-400" />}
          />
        </div>

        {/* Hoạt động gần đây (List) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h2>
            <p className="text-sm text-gray-500 mt-1">Các thay đổi quan trọng trong hệ thống</p>
          </div>

          <div className="space-y-0 divide-y divide-gray-100">
            <ActivityItem 
              color="bg-success"
              title="Thêm trưởng tòa mới"
              desc="Nguyễn Văn X - Tòa A"
              time="2 giờ trước"
            />
            <ActivityItem 
              color="bg-primary"
              title="Duyệt đơn đăng ký"
              desc="15 đơn đăng ký KTX kỳ mới"
              time="5 giờ trước"
            />
            <ActivityItem 
              color="bg-warning"
              title="Cảnh báo vi phạm"
              desc="Phòng A301 - Vi phạm quy định"
              time="1 ngày trước"
            />
            <ActivityItem 
              color="bg-primary"
              title="Cập nhật cấu hình"
              desc="Thay đổi giá điện/nước"
              time="2 ngày trước"
            />
          </div>
        </div>

      </main>
    </div>
  );
}

// --- CÁC COMPONENT CON (Viết ngay trong file cho gọn) ---

function TabItem({ children, active }) {
  return (
    <button className={`
      flex-1 md:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap
      ${active 
        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
    `}>
      {children}
    </button>
  );
}

function StatCard({ title, value, subtext, icon, isDanger }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <span className="text-gray-600 font-medium text-sm">{title}</span>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</div>
        <div className={`text-xs font-medium ${isDanger ? 'text-danger' : 'text-gray-500'}`}>
          {subtext}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ color, title, desc, time }) {
  return (
    <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
      {/* Chấm tròn */}
      <div className={`mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`}></div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{desc}</p>
      </div>
      
      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{time}</span>
    </div>
  );
}