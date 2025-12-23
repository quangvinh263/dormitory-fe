import React, { useState, useEffect } from 'react';
import { getBillsByManager } from '../../services/utilityBillApi';
import UtilityStats from '../../components/features/manager/UtilityStats';
import UtilityHeader from '../../components/features/manager/UtilityHeader';
import UtilityTable from '../../components/features/manager/UtilityTable';
import UtilityInputModal from '../../components/features/manager/UtilityInputModal';
import ConfirmationModal from '../../components/features/manager/ConfirmationModal';

export default function UtilityDashboard() {
  // --- 1. STATE QUẢN LÝ ---
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // State cho tháng/năm
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // --- 2. LOAD DATA FROM API ---
  const loadBillsData = async () => {
    setLoading(true);
    try {
      const requestData = {
        accountId: localStorage.getItem('accountId'),
        month: selectedMonth,
        year: selectedYear
      };

      console.log('Request Data for Bills:', requestData);
      const result = await getBillsByManager(requestData);
      
      if (result.success && result.data) {
        const transformedData = result.data.map(bill => {
          let status = 'not_entered';
          if (bill.status === 'Paid') status = 'paid';
          else if (bill.status === 'Unpaid') status = 'unpaid';
          else if (bill.status === 'No Bill') status = 'not_entered';

          return {
            id: bill.roomName,
            roomID: bill.roomID,
            oldElec: bill.electricityOldIndex,
            newElec: bill.electricityNewIndex,
            usageElec: bill.electricityUsage,
            oldWater: bill.waterOldIndex,
            newWater: bill.waterNewIndex,
            usageWater: bill.waterUsage,
            totalBill: bill.amount,
            status: status
          };
        });

        setRoomData(transformedData);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  // --- 3. CALCULATE STATS ---
  const calculateStats = () => {
    const totalPaid = roomData.filter(r => r.status === 'paid').length;
    const totalUnpaid = roomData.filter(r => r.status === 'unpaid').length;
    const totalNotEntered = roomData.filter(r => r.status === 'not_entered').length;
    const totalAmount = roomData.reduce((sum, r) => sum + r.totalBill, 0);

    return [
      { 
        label: 'Tổng thanh toán', 
        value: `₫${totalAmount.toLocaleString('vi-VN')}`, 
        subtext: `Tháng ${selectedMonth}/${selectedYear}`, 
        type: 'default' 
      },
      { 
        label: 'Đã thanh toán', 
        value: totalPaid.toString(), 
        subtext: 'phòng', 
        type: 'success' 
      },
      { 
        label: 'Chưa thanh toán', 
        value: totalUnpaid.toString(), 
        subtext: 'phòng', 
        type: 'warning' 
      },
      { 
        label: 'Chưa nhập chỉ số', 
        value: totalNotEntered.toString(), 
        subtext: 'phòng', 
        type: 'danger' 
      },
    ];
  };

  const statsData = calculateStats();

  // --- 4. HANDLERS ---
  const handleEnterClick = (room) => {
    console.log('Opening modal for room:', room);
    setSelectedRoom(room);
  };

  const handleInputSave = async () => {
    // Reload data sau khi save thành công
    await loadBillsData();
    setSelectedRoom(null);
  };

  const handleMonthYearChange = (month, year) => {
    console.log('Month/Year changed to:', month, year);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // --- 5. RENDER ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <UtilityStats stats={statsData} />

      <div className="space-y-4">
        <UtilityHeader 
          onRefresh={loadBillsData}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthYearChange={handleMonthYearChange}
        />
        
        <UtilityTable 
          data={roomData} 
          onEnterClick={handleEnterClick}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>

      {selectedRoom && (
        <UtilityInputModal 
          room={selectedRoom}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => setSelectedRoom(null)}
          onSave={handleInputSave}
        />
      )}
    </div>
  );
}