// src/components/shared/header/LogoutButton.jsx
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
      <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
      <span>Đăng xuất</span>
    </button>
  );
}