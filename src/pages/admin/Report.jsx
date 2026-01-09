import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { 
  exportAvailableRooms, 
  exportExpiredContracts, 
  exportStudentContracts, 
  exportPriorityStudents, 
  exportRoomEquipment, 
  exportManagers 
} from '../../services/reportApi';

// 1. Imports Components Chung
import ReportStats from '../../components/features/admin/ReportStats';
import ReportMenu from '../../components/features/admin/ReportMenu'; 
import FinanceReport from '../../components/features/admin/FinanceReport';

// 2. Imports 6 Báo cáo con
import EmptyRoomsReport from '../../components/features/admin/contents/EmptyRoomsReport';
import ExpiredContractsReport from '../../components/features/admin/contents/ExpiredContractsReport';
import StudentContractsReport from '../../components/features/admin/contents/StudentContractsReport';
import PriorityStudentsReport from '../../components/features/admin/contents/PriorityStudentsReport';
import EquipmentReport from '../../components/features/admin/contents/EquipmentReport';
import ManagerReport from '../../components/features/admin/contents/ManagerReport';

const SystemReport = () => {
  const [activeTab, setActiveTab] = useState('capacity'); // 'capacity' hoặc 'finance'
  const [currentReport, setCurrentReport] = useState('empty_rooms'); // Tab con (Phòng trống, HĐ...)
  const [exporting, setExporting] = useState(false);

  // Mapping các report với export function tương ứng
  const exportFunctions = {
    'empty_rooms': exportAvailableRooms,
    'expired_contracts': exportExpiredContracts,
    'student_contracts': exportStudentContracts,
    'priority_students': exportPriorityStudents,
    'equipment': exportRoomEquipment,
    'managers': exportManagers
  };

  // Hàm xuất báo cáo chung
  const handleExport = async () => {
    const exportFunction = exportFunctions[currentReport];

    if (!exportFunction) {
      alert('Chức năng xuất báo cáo chưa được hỗ trợ cho loại báo cáo này');
      return;
    }

    try {
      setExporting(true);
      const result = await exportFunction();
      
      if (!result.success) {
        alert(result.message || 'Đã xảy ra lỗi khi xuất báo cáo');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Đã xảy ra lỗi khi xuất báo cáo');
    } finally {
      setExporting(false);
    }
  };

  // Hàm render nội dung tương ứng với menu con (Chỉ dùng cho Công suất)
  const renderDetailReport = () => {
    switch (currentReport) {
      case 'empty_rooms': return <EmptyRoomsReport />;
      case 'expired_contracts': return <ExpiredContractsReport />;
      case 'student_contracts': return <StudentContractsReport />;
      case 'priority_students': return <PriorityStudentsReport />;
      case 'equipment': return <EquipmentReport />;
      case 'managers': return <ManagerReport />;
      default: return <EmptyRoomsReport />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* 1. HEADER & TAB CHÍNH (Phần chung) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Hệ Thống</h1>
          <p className="text-sm text-gray-500 mt-1">Phân tích và thống kê tổng quan</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-gray-100 p-1 rounded-xl inline-flex">
        {['capacity', 'finance'].map((tab) => (
           <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'capacity' ? 'Công suất' : 'Tài chính'}
           </button>
        ))}
      </div>

      {/* 2. NỘI DUNG THAY ĐỔI THEO TAB */}
      {activeTab === 'capacity' ? (
        <>
            {/* Stats Cards (Chỉ hiện ở Công Suất) */}
            <ReportStats />

            {/* Container Báo cáo & Xuất dữ liệu (Khung trắng bao quanh) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[500px]">
                
                {/* Header của Container */}
                <div className="mb-6 pb-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Báo Cáo & Xuất Dữ Liệu</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Tạo và xuất các loại báo cáo hệ thống (chỉ dành cho Quản lý và Admin)
                        </p>
                    </div>
                    {!['expired_contracts', 'student_contracts', 'equipment'].includes(currentReport) && (
                        <button 
                            onClick={handleExport}
                            disabled={exporting}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm ${
                                exporting 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            <ArrowDownTrayIcon className="w-4 h-4"/> 
                            <span>{exporting ? 'Đang xuất...' : 'Xuất báo cáo'}</span>
                        </button>
                    )}
                </div>

                {/* Nội dung bên trong khung trắng */}
                <div>
                    <ReportMenu activeTab={currentReport} onChange={setCurrentReport} />
                    <div className="mt-4">
                        {renderDetailReport()}
                    </div>
                </div>
            </div>
        </>
      ) : (
        <div className="mt-2">
            <FinanceReport />
        </div>
      )}

    </div>
  );
};

export default SystemReport;