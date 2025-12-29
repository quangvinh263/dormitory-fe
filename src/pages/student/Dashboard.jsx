import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  HomeIcon, CurrencyDollarIcon, ExclamationTriangleIcon, 
  HeartIcon, DocumentTextIcon, BoltIcon, ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import { getDashboardStats } from '../../services/studentApi';

import { refreshAccessToken } from '../../services/tokenApi';


// Import các Shared/UI Components
import StatCard from '../../components/shared/StatCard';
import Section from '../../components/shared/Section';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Lấy accountId từ localStorage hoặc auth context
        const accountId = localStorage.getItem('accountId'); // Điều chỉnh theo cách bạn lưu accountId
        const response = await getDashboardStats(accountId);
        if (response && response.data) {
          setDashboardData(response.data.dashboardData);
          console.log('Dashboard Data:', response.data);
          // Tính số ngày còn lại
          if (response.data.dashboardData.currentContract?.endDate) {
            const endDate = new Date(response.data.dashboardData.currentContract.endDate);
            const today = new Date();
            const diffTime = endDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            setDaysRemaining(diffDays);
            // Hiển thị cảnh báo nếu còn dưới 30 ngày
            setShowWarning(diffDays > 0 && diffDays <= 30);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Danh sách thao tác nhanh
  const quickActions = [
    { label: 'Đăng ký / Gia hạn', path: '/student/extension', icon: <DocumentTextIcon className="w-6 h-6"/> },
    { label: 'Hóa đơn & Thanh toán', path: '/student/utility', icon: <BoltIcon className="w-6 h-6"/> },
    { label: 'Đăng ký BHYT', path: '/student/insurance', icon: <HeartIcon className="w-6 h-6"/> },
    { label: 'Xem hợp đồng', path: '/student/contract', icon: <ShieldCheckIcon className="w-6 h-6"/> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  const contract = dashboardData?.currentContract;
  const insuranceStatus = dashboardData?.insuranceStatus === 'Active' ? 'Đã mua' : 'Chưa mua';
  const insuranceEndDate = dashboardData?.insuranceEndDate ? formatDate(dashboardData.insuranceEndDate) : 'N/A';

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. CẢNH BÁO - Chỉ hiện khi còn dưới 30 ngày */}
      {showWarning && contract && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-lg shrink-0">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-orange-800 mb-1">Hợp đồng sắp hết hạn!</h3>
            <p className="text-orange-700 text-sm mb-4">
              Hợp đồng của bạn sẽ hết hạn vào ngày <span className="font-bold">{formatDate(contract.endDate)}</span> 
              {daysRemaining > 0 ? ` (còn ${daysRemaining} ngày)` : ' (đã hết hạn)'}. 
              Hãy gia hạn sớm để tránh gián đoạn lưu trú.
            </p>
            <Link to="/student/register">
              <Button className="bg-orange-500 hover:bg-orange-600 border-none shadow-orange-200 text-white">
                Gia hạn ngay
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 2. THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Trạng thái ở" 
          value={contract?.status === 'Active' || contract?.status === 'NearExpiration' ? 'Đang ở' : 'Không hoạt động'} 
          subtext={contract?.roomName ? `Phòng ${contract.roomName}` : 'Chưa có phòng'} 
          icon={<HomeIcon className="w-5 h-5"/>} 
          type={contract?.status === 'Active' || contract?.status === 'NearExpiration' ? 'success' : 'default'} 
        />
        <StatCard 
          title="Hóa đơn nợ" 
          value={dashboardData?.countUnpaidBills || 0} 
          subtext={dashboardData?.countUnpaidBills > 0 ? 'Cần thanh toán' : 'Không có nợ'} 
          icon={<CurrencyDollarIcon className="w-5 h-5"/>} 
          type={dashboardData?.countUnpaidBills > 0 ? 'warning' : 'success'} 
        />
        <StatCard 
          title="Vi phạm" 
          value={dashboardData?.countViolations || 0} 
          subtext={dashboardData?.countViolations > 0 ? 'Có vi phạm' : 'Không có vi phạm'} 
          icon={<ExclamationTriangleIcon className="w-5 h-5"/>} 
          type={dashboardData?.countViolations > 0 ? 'warning' : 'success'} 
        />
        <StatCard 
          title="Bảo hiểm Y tế" 
          value={insuranceStatus} 
          subtext={insuranceEndDate !== 'N/A' ? `Hết hạn: ${insuranceEndDate}` : 'Chưa đăng ký'} 
          icon={<HeartIcon className="w-5 h-5"/>}
          type={dashboardData?.insuranceStatus === 'Active' ? 'success' : 'default'}
        />
      </div>

      {/* 3. THAO TÁC NHANH */}
      <Section title="Thao Tác Nhanh">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((btn, idx) => (
            <Link 
              key={idx} 
              to={btn.path}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="p-3 bg-white rounded-full shadow-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                {btn.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 text-center">
                {btn.label}
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}