import { BellIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ROLES, ROLE_THEME } from '../../utils/constants';

// Import các component con đã tách
import StudentDropdown from './header/StudentDropdown';
import LogoutButton from './header/LogoutButton';

export default function Header({ user }) {
  // Lấy theme dựa trên role, nếu không có thì mặc định là STUDENT
  const roleConfig = ROLE_THEME[user?.role] || ROLE_THEME[ROLES.STUDENT];

  // Logic hiển thị subtext
  const getSubText = () => {
    if (user?.role === ROLES.ADMIN) return `Xin chào, ${user?.name || 'Quản Trị Viên'}`;
    return `${user?.name} - ${user?.code}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* --- TRÁI: LOGO & TITLE --- */}
        <div className="flex items-center gap-3">
          <div className={clsx("p-2 rounded-lg shadow-sm text-white", roleConfig.colorClass)}>
            <BuildingOfficeIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              {roleConfig.title}
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              {getSubText()}
            </p>
          </div>
        </div>

        {/* --- PHẢI: ACTION --- */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center ring-2 ring-white">
              2
            </span>
          </button>

          {/* Kiểm tra Role để hiển thị đúng Component */}
          {user?.role === ROLES.STUDENT ? (
            <StudentDropdown user={user} />
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
}