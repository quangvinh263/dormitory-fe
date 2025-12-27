import React from 'react';
import { 
  UserPlusIcon, 
  BuildingLibraryIcon, 
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const actions = [
  {
    title: "Cấp tài khoản Manager",
    desc: "Tạo tài khoản cho trưởng tòa mới",
    icon: UserPlusIcon,
    btnText: "Tạo tài khoản",
    btnColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "Cấu hình Giá dịch vụ",
    desc: "Cập nhật đơn giá Điện/Nước",
    icon: CurrencyDollarIcon,
    btnText: "Cập nhật giá",
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  {
    title: "Thêm Tòa nhà / Phòng",
    desc: "Mở rộng quy mô ký túc xá",
    icon: BuildingLibraryIcon,
    btnText: "Thêm mới",
    btnColor: "bg-purple-600 hover:bg-purple-700"
  },
  {
    title: "Tham số hệ thống",
    desc: "Cài đặt hạn đóng tiền, quy định",
    icon: AdjustmentsHorizontalIcon,
    btnText: "Cấu hình",
    btnColor: "bg-gray-800 hover:bg-gray-900"
  }
];

const AdminQuickActions = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Quản trị nhanh</h3>
        <p className="text-sm text-gray-500 mt-1">Các tác vụ thường dùng của Admin</p>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto flex-1">
        {actions.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-all bg-gray-50/50 hover:bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <item.icon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
            {/* Trên mobile nút này có thể ẩn hoặc hiện icon */}
            <button className={`hidden sm:block text-xs font-bold text-white px-3 py-2 rounded-lg transition-colors ${item.btnColor}`}>
              {item.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuickActions;