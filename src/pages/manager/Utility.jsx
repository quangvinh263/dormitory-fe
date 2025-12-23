import React, { useState } from 'react';

import UtilityStats from '../../components/features/manager/UtilityStats';
import UtilityHeader from '../../components/features/manager/UtilityHeader';
import UtilityTable from '../../components/features/manager/UtilityTable';
import UtilityInputModal from '../../components/features/manager/UtilityInputModal';
import ConfirmationModal from '../../components/features/manager/ConfirmationModal';

export default function UtilityDashboard() {
  // --- 1. CONFIG & MOCK DATA ---
  
  // Dữ liệu thống kê (StatCards)
  const statsData = [
    { label: 'Tổng thanh toán', value: '₫850.000', subtext: 'Tháng 08/2024', type: 'default' },
    { label: 'Đã thanh toán', value: '1', subtext: 'phòng', type: 'success' },
    { label: 'Chưa thanh toán', value: '1', subtext: 'phòng', type: 'warning' },
    { label: 'Chưa nhập chỉ số', value: '1', subtext: 'phòng', type: 'danger' },
  ];

  // Giá điện nước hiện hành
  const ratesData = {
    electricity: 3500, // VND/kWh
    water: 15000       // VND/m3
  };

  // Dữ liệu danh sách phòng (State chính của trang)
  const [roomData, setRoomData] = useState([
    { 
      id: 'A301', 
      oldElec: 1250, newElec: 1350, usageElec: 100, 
      oldWater: 85, newWater: 90, usageWater: 5, 
      totalBill: 425000, 
      status: 'paid' 
    },
    { 
      id: 'A302', 
      oldElec: 980, newElec: 1080, usageElec: 100, 
      oldWater: 62, newWater: 67, usageWater: 5, 
      totalBill: 425000, 
      status: 'unpaid' 
    },
    { 
      id: 'A303', 
      oldElec: 1400, newElec: 0, usageElec: 0, 
      oldWater: 120, newWater: 0, usageWater: 0, 
      totalBill: 0, 
      status: 'not_entered' 
    },
     { 
      id: 'A304', 
      oldElec: 1100, newElec: 0, usageElec: 0, 
      oldWater: 50, newWater: 0, usageWater: 0, 
      totalBill: 0, 
      status: 'not_entered' 
    },
  ]);

  // --- 2. STATE QUẢN LÝ MODAL ---
  const [selectedRoom, setSelectedRoom] = useState(null); // Phòng đang được chọn để nhập liệu
  const [tempData, setTempData] = useState(null);         // Dữ liệu vừa nhập xong (chưa lưu chính thức)
  const [showConfirm, setShowConfirm] = useState(false);  // Trạng thái hiển thị Popup xác nhận

  // --- 3. HANDLERS (XỬ LÝ SỰ KIỆN) ---

  // Bước 1: Người dùng bấm nút "Nhập" trên bảng -> Mở Modal Nhập
  const handleEnterClick = (room) => {
    setSelectedRoom(room);
  };

  // Bước 2: Người dùng bấm "Lưu chỉ số" trong Modal Nhập -> Lưu tạm & Mở Confirm
  const handleInputSave = (dataWithNewValues) => {
    setTempData(dataWithNewValues); // Lưu dữ liệu tính toán vào biến tạm
    setSelectedRoom(null);          // Đóng Modal Nhập
    setShowConfirm(true);           // Mở Modal Xác nhận
  };

  // Bước 3: Người dùng bấm "Đồng ý" trong Modal Xác nhận -> Cập nhật dữ liệu thật
  const handleFinalConfirm = () => {
    if (!tempData) return;

    // Tìm và cập nhật phòng tương ứng trong mảng roomData
    const updatedRooms = roomData.map(r => 
      r.id === tempData.id ? tempData : r
    );

    setRoomData(updatedRooms); // Cập nhật State giao diện
    
    // Reset các state tạm
    setShowConfirm(false);
    setTempData(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Điện Nước</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý các hóa đơn điện nước của sinh viên</p>
      </div>
      {/* MODULE 1: THỐNG KÊ (Top Cards) */}
      <UtilityStats stats={statsData} />

      <div className="space-y-4">
        {/* MODULE 2: HEADER & FILTER */}
        <UtilityHeader />
        
        {/* MODULE 3: BẢNG DỮ LIỆU */}
        <UtilityTable 
          data={roomData} 
          rates={ratesData} 
          onEnterClick={handleEnterClick} 
        />
      </div>

      {/* --- KHU VỰC POPUP / MODAL --- */}
      
      {/* 1. Modal Nhập Liệu  */}
      {selectedRoom && (
        <UtilityInputModal 
          room={selectedRoom}
          rates={ratesData}
          onClose={() => setSelectedRoom(null)}
          onSave={handleInputSave}
        />
      )}

      {/* 2. Modal Xác Nhận  */}
      <ConfirmationModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFinalConfirm}
      />

    </div>
  );
}