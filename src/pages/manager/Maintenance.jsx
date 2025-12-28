import React, { useState, useContext, useEffect, useMemo } from 'react';
import { 
  CurrencyDollarIcon, WrenchScrewdriverIcon, ClipboardDocumentListIcon,
  ClockIcon, CheckBadgeIcon, BanknotesIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

import StatCard from '../../components/shared/StatCard';
import { AuthContext } from '../../context/AuthContext';
import MaintenanceFilter from '../../components/features/manager/MaintenanceFilter';
import MaintenanceCard from '../../components/features/manager/MaintenanceCard';
import MaintenanceDetailModal from '../../components/features/manager/MaintenceDetailModal';

// Import API
import { getMaintenances } from '../../services/maintenanceApi';
import { getManagerInfo } from '../../services/managerApi';

export default function MaintenanceDashboard() {
    const { auth } = useContext(AuthContext);

    // State
    const [loading, setLoading] = useState(true); 
    const [listLoading, setListLoading] = useState(false); 
    const [refreshKey, setRefreshKey] = useState(0);
    
    const [managerBuildingId, setManagerBuildingId] = useState(null); 
    
    const [requests, setRequests] = useState([]);       // List hiển thị
    const [allRequests, setAllRequests] = useState([]); // Stats tổng quan
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [filter, setFilter] = useState({ 
        keyword: '', 
        status: '', 
        equipment: '' 
    });

    // --- BƯỚC 1: LẤY BUILDING ID CỦA QUẢN LÝ ---
    useEffect(() => {
        const fetchBuildingId = async () => {
            if (!auth?.accountId) return;
            try {
                const res = await getManagerInfo(auth.accountId);
                if (res.success && res.data?.buildingDto?.buildingID) {
                    setManagerBuildingId(res.data.buildingDto.buildingID);
                } else {
                    console.warn("Không tìm thấy thông tin tòa nhà!");
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin quản lý:", error);
            }
        };
        fetchBuildingId();
    }, [auth.accountId]);


    // --- BƯỚC 2: LẤY SỐ LIỆU THỐNG KÊ (STATS) ---
    useEffect(() => {
        if (!managerBuildingId) return; 
        const fetchStats = async () => {
            try {
                const res = await getMaintenances({ buildingId: managerBuildingId });
                
                if (res.success && Array.isArray(res.data)) {
                    setAllRequests(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy stats:", error);
            }
        };
        fetchStats();
    }, [managerBuildingId, refreshKey]); 


    // --- BƯỚC 3: LẤY DANH SÁCH HIỂN THỊ (LIST) ---
    useEffect(() => {
        let mounted = true;
        if (!managerBuildingId) return; 

        const fetchList = async () => {
            try {
                const params = { 
                    ...filter, 
                    buildingId: managerBuildingId 
                };

                const res = await getMaintenances(params);
                
                if (mounted) {
                    if (res.success && Array.isArray(res.data)) {
                        setRequests(res.data);
                    } else {
                        setRequests([]);
                    }
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách:", error);
            } finally {
                if (mounted) {
                    setListLoading(false);
                    setLoading(false); 
                }
            }
        };

        fetchList();
        return () => { mounted = false; };
    }, [managerBuildingId, filter, refreshKey]);


    const statsData = useMemo(() => {
        const source = allRequests; 
        return [
            { label: 'Tổng yêu cầu', value: source.length, type: 'default', subtext: 'Tất cả', icon: <ClipboardDocumentListIcon className="w-6 h-6"/> },
            { label: 'Chờ xác nhận', value: source.filter(r => r.status === 'Pending').length, type: 'warning', subtext: 'Cần duyệt', icon: <ClockIcon className="w-6 h-6"/> },
            { label: 'Đã xác nhận', value: source.filter(r => r.status === 'Confirmed').length, type: 'success', subtext: 'Đã nhận', icon: <CheckBadgeIcon className="w-6 h-6"/> },
            { label: 'Đang xử lý', value: source.filter(r => ['In Progress', 'Processing'].includes(r.status)).length, type: 'info', subtext: 'Đang làm', icon: <WrenchScrewdriverIcon className="w-6 h-6"/> },
            { label: 'Chờ thanh toán', value: source.filter(r => r.status === 'Wait Payment').length, type: 'danger', subtext: 'Chờ tiền', icon: <BanknotesIcon className="w-6 h-6"/> },
            { label: 'Hoàn thành', value: source.filter(r => r.status === 'Completed').length, type: 'success', subtext: 'Xong', icon: <CheckCircleIcon className="w-6 h-6"/> },
            { 
                label: 'Tổng chi phí', 
                value: source.reduce((total, r) => (r.status === 'Completed' || r.status === 'Wait Payment') ? total + (r.repairCost || 0) : total, 0).toLocaleString('vi-VN') + ' đ', 
                type: 'info', subtext: 'Doanh thu', icon: <CurrencyDollarIcon className="w-6 h-6"/> 
            },
        ];
    }, [allRequests]);


    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    // Màn hình loading tổng khi chưa có buildingId
    if (loading && !managerBuildingId) {
         return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
         )
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Yêu Cầu Sửa Chữa</h1>
                {managerBuildingId && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        Khu vực: Tòa nhà {managerBuildingId}
                    </span>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, index) => (
                    <div key={index} className="h-full">
                         <StatCard title={stat.label} value={stat.value} subtext={stat.subtext} type={stat.type} icon={stat.icon} />
                    </div>
                ))}
            </div>

            {/* Filter */}
            <MaintenanceFilter 
                filter={filter} 
                setFilter={setFilter}
                onClear={() => setFilter({ keyword: '', status: '', equipment: '' })}
            />

            {/* List Data */}
            <div className="space-y-4 relative">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-sm font-bold text-gray-700">Danh sách ({requests.length})</h2>
                </div>
                
                {/* Loading đè lên list khi filter */}
                {listLoading ? (
                    <div className="flex justify-center py-10">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {requests.map((req) => (
                            <MaintenanceCard 
                                key={req.maintenanceID} 
                                request={req} 
                                onAction={setSelectedRequest} 
                            />
                        ))}
                        
                        {requests.length === 0 && (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm">Không có dữ liệu hiển thị.</p>
                            </div>
                        )}
                    </>
                )}
            </div>   

            {selectedRequest && (
                <MaintenanceDetailModal 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)} 
                    onRefresh={handleRefresh}
                />
            )} 
        </div>
    );
}