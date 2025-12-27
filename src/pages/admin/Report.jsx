import React, { useState } from 'react';
import { CalendarDaysIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// 1. Imports Components Chung
import ReportStats from '../../components/features/admin/ReportStats';
import ReportMenu from '../../components/features/admin/ReportMenu'; 

// 2. Imports 6 Báo cáo con
import EmptyRoomsReport from '../../components/features/admin/contents/EmptyRoomsReport';
import ExpiredContractsReport from '../../components/features/admin/contents/ExpiredContractsReport';
import StudentContractsReport from '../../components/features/admin/contents/StudentContractsReport';
import PriorityStudentsReport from '../../components/features/admin/contents/PriorityStudentsReport';
import EquipmentReport from '../../components/features/admin/contents/EquipmentReport';
import ManagerReport from '../../components/features/admin/contents/ManagerReport';

const SystemReport = () => {
  const [activeTab, setActiveTab] = useState('capacity'); // Tab chính (Công suất/Tài chính)
  const [currentReport, setCurrentReport] = useState('empty_rooms'); // Tab con (Phòng trống, HĐ...)
  const [selectedYear, setSelectedYear] = useState('2024');

  // Hàm render nội dung tương ứng với menu con
  const renderDetailReport = () => {
    switch (currentReport) {
      case 'empty_rooms': return <EmptyRoomsReport />;
      case 'expired_contracts': return <ExpiredContractsReport />;
      case 'all_contracts': return <StudentContractsReport />;
      case 'priority_students': return <PriorityStudentsReport />;
      case 'equipment': return <EquipmentReport />;
      case 'managers': return <ManagerReport />;
      default: return <EmptyRoomsReport />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* 1. HEADER & TAB CHÍNH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Hệ Thống</h1>
          <p className="text-sm text-gray-500 mt-1">Phân tích và thống kê tổng quan</p>
        </div>
      </div>

      {/* Tabs Chính */}
      <div className="bg-gray-100 p-1 rounded-xl inline-flex">
        {['capacity', 'finance'].map((tab) => (
           <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'capacity' ? 'Công suất' : 'Tài chính'}
           </button>
        ))}
      </div>

      {/* 2. STATS CARDS (Chỉ hiện ở Tab Công Suất) */}
      {activeTab === 'capacity' && <ReportStats />}

      {/* 3. CONTAINER BÁO CÁO CHI TIẾT */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[500px]">
        
        {/* Header của Container */}
        <div className="mb-6 pb-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Báo Cáo & Xuất Dữ Liệu</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'capacity' 
                      ? 'Tạo và xuất các loại báo cáo hệ thống (chỉ dành cho Quản lý và Admin)' 
                      : 'Báo cáo chi tiết về doanh thu và công nợ'}
                </p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm">
                <ArrowDownTrayIcon className="w-4 h-4"/> <span>Xuất báo cáo</span>
            </button>
        </div>

        {/* Nội dung bên trong */}
        {activeTab === 'capacity' ? (
            <div>
                {/* Menu Con */}
                <ReportMenu activeTab={currentReport} onChange={setCurrentReport} />
                
                {/* Bảng Dữ Liệu */}
                <div className="mt-4">
                    {renderDetailReport()}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p>Nội dung báo cáo Tài Chính đang được phát triển...</p>
            </div>
        )}

      </div>

    </div>
  );
};

export default SystemReport;