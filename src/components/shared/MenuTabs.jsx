import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export default function MenuTabs({ menus = [] }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-gray-100 p-1.5 rounded-xl w-full flex overflow-x-auto gap-1 no-scrollbar">
      {menus.map((item) => {
        // Kiểm tra xem tab có đang active không
        const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              "flex-1 min-w-[120px] py-2.5 rounded-lg text-center text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out block select-none",
              isActive
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5 font-bold"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}