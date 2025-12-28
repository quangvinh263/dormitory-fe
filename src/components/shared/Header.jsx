import { BellIcon, BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useContext, useEffect, useState, useRef } from 'react';
import { ROLES, ROLE_THEME } from '../../utils/constants';
import { getStudentInfo } from '../../services/studentApi';
import { AuthContext } from '../../context/AuthContext';
import useNotificationSignalR from '../../hooks/useNotificationSignalR';
import { getLastestNotifications, markNotificationAsRead } from '../../services/notificationApi';
import { formatRelativeTime } from '../../utils/format'; // ✅ Import formatRelativeTime

import StudentDropdown from './header/StudentDropdown';
import LogoutButton from './header/LogoutButton';

export default function Header({ user }) {
  const { auth } = useContext(AuthContext);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State quản lý notifications - Khởi tạo với mảng rỗng
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // SignalR hook để nhận realtime notifications
  const { notifications: realtimeNotifications } = useNotificationSignalR();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notiRef = useRef(null);

  // Fetch student data và notifications
  useEffect(() => {
    const fetchStudentData = async () => {
      if (auth.role === ROLES.STUDENT && auth.accountId) {
        try {
          // Fetch student info
          const result = await getStudentInfo(auth.accountId);
          if (result.success) {
            setStudentData({
              name: result.data.fullName || result.data.name,
              code: result.data.studentID || result.data.studentCode,
              email: result.data.email
            });
          }

          // Fetch notifications
          const notiResult = await getLastestNotifications(auth.accountId);
                    
          // ✅ Fix: notiResult.notifications chứ không phải notiResult.data.notifications
          if (notiResult && notiResult.notifications) {
            setNotifications(notiResult.notifications);
            setUnreadCount(notiResult.notifications.filter(n => !n.isRead).length);
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [auth.role, auth.accountId]);

  // Merge realtime notifications với notifications hiện tại
  useEffect(() => {
    if (realtimeNotifications && realtimeNotifications.length > 0) {
      
      // Thêm realtime notifications vào đầu danh sách, loại bỏ duplicate
      setNotifications(prev => {
        const existingIds = prev.map(n => n.notificationID);
        const newNotifications = realtimeNotifications.filter(
          n => !existingIds.includes(n.notificationID)
        );
        return [...newNotifications, ...prev];
      });
      
      // Cập nhật unread count
      setUnreadCount(prev => prev + realtimeNotifications.filter(n => !n.isRead).length);
    }
  }, [realtimeNotifications]);

  // Click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleConfig = ROLE_THEME[auth?.role || user?.role] || ROLE_THEME[ROLES.STUDENT];

  const getSubText = () => {
    if (auth?.role === ROLES.ADMIN || user?.role === ROLES.ADMIN) {
      return `Xin chào, ${user?.name || 'Quản Trị Viên'}`;
    }
    if (auth?.role === ROLES.STUDENT && studentData) {
      return `${studentData.name} - ${studentData.id}`;
    }
    return `${user?.name || ''} - ${user?.code || ''}`;
  };

  // ✅ Handler khi click vào notification
  const handleNotificationClick = async (noti) => {
    // Nếu chưa đọc → Gọi API mark as read
    if (!noti.isRead) {
      try {
        const result = await markNotificationAsRead(noti.notificationID);
        
        if (result.success) {
          // Cập nhật UI: đánh dấu notification là đã đọc
          setNotifications(prev => 
            prev.map(n => 
              n.notificationID === noti.notificationID 
                ? { ...n, isRead: true } 
                : n
            )
          );
          
          // Giảm unread count
          setUnreadCount(prev => Math.max(0, prev - 1));
        } else {
          console.error('❌ Failed to mark as read:', result.message);
        }
      } catch (error) {
        console.error('❌ Error marking notification as read:', error);
      }
    }
    
    // TODO: Navigate hoặc hiển thị chi tiết notification (nếu cần)
    // Ví dụ: if (noti.type === 'UtilityBill') navigate('/bills');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* TRÁI: LOGO & TITLE */}
        <div className="flex items-center gap-3">
          <div className={clsx("p-2 rounded-lg shadow-sm text-white", roleConfig.colorClass)}>
            <BuildingOfficeIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              {roleConfig.title}
            </h1>
            {loading && auth?.role === ROLES.STUDENT ? (
              <div className="h-5 w-48 bg-gray-200 animate-pulse rounded mt-0.5" />
            ) : (
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {getSubText()}
              </p>
            )}
          </div>
        </div>

        {/* PHẢI: ACTION */}
        <div className="flex items-center gap-4">
          
          {/* THÔNG BÁO */}
          <div className="relative" ref={notiRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={clsx(
                "relative p-2 rounded-full transition-colors cursor-pointer",
                showNotifications ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
            >
              <BellIcon className="h-6 w-6" />
              
              {/* Badge số lượng chưa đọc */}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden origin-top-right animate-fade-in-up z-50">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-800">
                    Thông báo {unreadCount > 0 && `(${unreadCount} chưa đọc)`}
                  </h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                      <BellIcon className="w-8 h-8 mb-2 opacity-20" />
                      <span className="text-sm">Không có thông báo mới</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((noti, index) => (
                        <div 
                          key={noti.notificationID || index}
                          onClick={() => handleNotificationClick(noti)}
                          className={clsx(
                            "p-4 transition-colors cursor-pointer",
                            noti.isRead ? "hover:bg-gray-50" : "bg-blue-50/30 hover:bg-blue-50/50"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className={clsx(
                                "w-2 h-2 rounded-full mt-1.5",
                                noti.isRead ? "bg-gray-300" : "bg-blue-500"
                              )}></div>
                            </div>
                            <div className="flex-1">
                              <p className={clsx(
                                "text-sm mb-0.5",
                                noti.isRead ? "font-medium text-gray-700" : "font-semibold text-gray-900"
                              )}>
                                {noti.title}
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                {noti.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatRelativeTime(noti.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                      Xem tất cả
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {(auth?.role === ROLES.STUDENT || user?.role === ROLES.STUDENT) ? (
            <StudentDropdown user={studentData || user} />
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
}