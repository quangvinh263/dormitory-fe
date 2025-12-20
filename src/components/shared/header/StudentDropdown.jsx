import { Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getInitials } from '../../../utils/format';
import { getStudentInfo } from '../../../services/studentApi';
import { signOut } from '../../../services/authApi';
import { AuthContext } from '../../../context/AuthContext';

export default function StudentDropdown() {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin student từ API
  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!auth.accountId) {
        navigate('/auth/login');
        return;
      }

      try {
        const result = await getStudentInfo(auth.accountId);
        console.log('accountId:', auth.accountId);
        if (result.success) {
          setUser({
            name: result.data.fullName || result.data.name,
            email: result.data.email,
            code: result.data.studentId || result.data.studentCode
          });
        } else {
          console.error('Failed to fetch student info:', result.message);
        }
      } catch (error) {
        console.error('Error fetching student info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [auth.accountId, navigate]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    
     logout();
      navigate('/auth/login');
    
  };

  // Hiển thị loading hoặc placeholder khi chưa có dữ liệu
  if (loading || !user) {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-300 animate-pulse"></div>
    );
  }

  return (
    <Menu as="div" className="relative ml-3">
      {/* Nút Avatar tròn */}
      <Menu.Button className="flex items-center gap-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 p-1 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(user.name)}
        </div>
        <div className="hidden md:block text-left mr-1">
          <p className="text-sm font-semibold text-gray-700">{user.name}</p>
        </div>
      </Menu.Button>

      {/* Nội dung Popup */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none divide-y divide-gray-100">
           
           {/* Phần 1: Thông tin User */}
           <div className="px-5 py-3">
              <p className="text-base font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase font-medium">
                MSSV: {user.code}
              </p>
           </div>

           {/* Phần 2: Các hành động */}
           <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link 
                    to="/student/profile"
                    className={clsx(active ? 'bg-gray-50' : '', 'flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700')}
                  >
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    Thông tin cá nhân
                  </Link>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button 
                    onClick={handleLogout}
                    className={clsx(active ? 'bg-red-50' : '', 'flex w-full items-center gap-3 px-5 py-2.5 text-sm text-red-600 font-medium')}
                  >
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-red-500" />
                    Đăng xuất
                  </button>
                )}
              </Menu.Item>
           </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}