import React, { useState,useContext, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import StatCard from '../../components/shared/StatCard';

import { AuthContext } from '../../context/AuthContext';

import MaintenanceFilter from '../../components/features/manager/MaintenanceFilter';
import MaintenanceCard from '../../components/features/manager/MaintenanceCard';
import MaintenanceDetailModal from '../../components/features/manager/MaintenceDetailModal';

import { getMaintenanceOverview,getMaintenanceDetail,getMaintenances } from '../../services/maintenanceApi';

export default function MaintenanceDashboard() {

    const { auth } = useContext(AuthContext)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests,setRequests] = useState([]);
    const [filter, setFilter] = useState({ keyword: '', status: '',equipment:'  ' });
    

    const handleOpenModal = async (request) => {
      setSelectedRequest(request);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
    };


    const statsData = [
    { 
        label: 'Tổng yêu cầu', 
        value: requests.length, 
        type: 'default', subtext: 'Tất cả yêu cầu', 
        icon: <ClipboardDocumentListIcon className="w-6 h-6"/> 
    },
    { 
        label: 'Chờ xác nhận', 
        value: requests.filter(r => r.status === 'Pending').length, // Thêm .length
        type: 'warning', subtext: 'Cần xem xét', 
        icon: <ClockIcon className="w-6 h-6"/> 
    },
    { 
        label: 'Đã xác nhận', 
        value: requests.filter(r => r.status === 'Confirmed').length, // Sửa status
        type: 'confirm', subtext: 'Đã xác nhận yêu cầu', 
        icon: <CheckBadgeIcon className="w-6 h-6"/> 
    },
    { 
        label: 'Đang xử lý', 
        value: requests.filter(r => ['In Progress', 'Processing'].includes(r.status)).length, // Sửa status
        type: 'info', subtext: 'Đang sửa chữa & vệ sinh', 
        icon: <WrenchScrewdriverIcon className="w-6 h-6"/> 
    },
    { 
        label: 'Chờ thanh toán', 
        value: requests.filter(r => r.status === 'Wait Payment').length , // Sửa status
        type: 'wait', subtext: 'Đã sửa xong & chờ thanh toán', 
        icon: <BanknotesIcon className="w-6 h-6"/> 
    },
    { 
        label: 'Hoàn thành', 
        value: requests.filter(r => r.status === 'Completed').length, // Sửa status
        type: 'success', subtext: 'Yêu cầu đã hoàn thành', 
        icon: <CheckCircleIcon className="w-6 h-6"/> 
    },
    { 
        label: 'Tổng chi phí', 
        // Logic tính tổng tiền
        value: requests.reduce((total, r) => {
            return (r.status === 'Completed' || r.status === 'Wait Payment') 
                ? total + (r.repairCost || 0) 
                : total;
        }, 0).toLocaleString('vi-VN') + ' đ', 
        type: 'default', subtext: 'Tổng chi phí sửa chữa', 
        icon: <CurrencyDollarIcon className="w-6 h-6"/> 
    },
];
  
  useEffect(()=>{
    let mounted = true
    const accountId = auth?.accountId || localStorage.getItem('accountId')
    if (!accountId) {
      setError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.')
      setLoading(false)
      return
    }
    
    const fecth =async()=>{
      setLoading(true);
      try
      {
        const listRes = await getMaintenances(filter);   // API 1: Lấy danh sách     // API 2: Lấy số liệu tổng quan (Server tính sẵn)
;
        if (!mounted) return;
        if (listRes.success) {
            setRequests(Array.isArray(listRes.data) ? listRes.data : []);
        }

      }
      catch (error) {
          console.error("Lỗi tải dữ liệu Manager:", error);
      }
      finally 
      {
       if (mounted) setLoading(false);
      }
    }
    fecth()
    return () => { mounted = false }
  },[auth,filter,refreshKey])
  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="animate-fade-in-up space-y-6">
      
      {/* 1. Header Page */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Yêu Cầu Sửa Chữa</h1>
        <p className="text-sm text-gray-500 mt-1">Xử lý các yêu cầu sửa chữa, bảo trì từ sinh viên</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="h-full">
            <StatCard
              title={stat.label}
              value={stat.value}
              subtext={stat.subtext}
              type={stat.type}
              icon={stat.icon}
            />
          </div>
        ))}
      </div>

      {/* 2. Bộ lọc */}
      <MaintenanceFilter 
        filter={filter} 
        setFilter={setFilter}
        onClear={() => setFilter({ keyword: '', status: '', equipmentName: '' })}
        />

      {/* 3. Danh sách yêu cầu */}
      <div className="space-y-4">
        {/* Header List */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-gray-700">Danh sách yêu cầu ({requests.length})</h2>
        </div>

        {/* Render List */}
        {requests.map((req) => (
          <MaintenanceCard key={req.maintenanceID} request={req} onAction={handleOpenModal} />
        ))}
        
        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">Chưa có yêu cầu sửa chữa nào.</p>
          </div>
        )}
      </div>   

      {selectedRequest && (
        <MaintenanceDetailModal 
          request={selectedRequest} 
          onClose={handleCloseModal} 
          onRefresh={() => setRefreshKey(old => old + 1)}
        />
      )} 

    </div>
  );
}