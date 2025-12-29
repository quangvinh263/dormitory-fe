import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, CheckCircleIcon, ExclamationCircleIcon, BanknotesIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../../utils/format';


const RoomChangeModal = ({ isOpen, onClose, contract, availableRooms, onConfirm, isLoading }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reason, setReason] = useState("0"); 
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedRoom(null);
      setReason("0");
      setNote('');
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredRooms = (availableRooms || []).filter(room => 
  room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) &&
  room.roomName.trim() !== contract?.roomName
  );

  // 1. Lấy số ngày còn lại trong hợp đồng
  const remainingDays = contract?.remainingDays || 0;

  // 2. Tính đơn giá ngày 
  const dailyOldPrice = (contract?.roomPrice || 600000) / 365;
  const dailyNewPrice = (selectedRoom?.price || 0) / 365;

  // 3. Tính chênh lệch tổng cho những ngày còn lại
  const remainingAmount = remainingDays * (dailyNewPrice - dailyOldPrice);

  let finalAdjustment = 0;

  if (reason === "0") {
      // Hoàn 50% phí ngày còn lại phòng cũ
      const refundOldRoom = (remainingDays * dailyOldPrice) * 0.5;
      finalAdjustment = remainingAmount - refundOldRoom;
  } else { // PersonalRequest
      if (dailyNewPrice > dailyOldPrice) {
          finalAdjustment = remainingAmount;
      } else {
          finalAdjustment = 0; 
      }
  }

  const diffAmount = finalAdjustment;
  const isCharge = diffAmount > 0;

  const handleSubmit = () => {
    if (!selectedRoom) return;

    onConfirm({
      contractId: contract.id,
      newRoomId: selectedRoom.roomID,
      reason: parseInt(reason),
      note: note,
      diffAmount: diffAmount
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* 1. Thay đổi height để không bị quá dài trên mobile (h-[90vh]) */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[85vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <HomeModernIcon className="w-6 h-6 text-blue-600" />
              Đổi phòng sinh viên
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              SV: <span className="font-semibold text-blue-700">{contract?.studentName}</span> ({contract?.studentID}) 
              <span className="mx-2 hidden sm:inline">•</span> 
              <span className="block sm:inline">Hiện tại: <span className="font-semibold text-gray-800">{contract?.roomName}</span></span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-400 hover:text-red-500">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* BODY: Thay đổi chính ở đây */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* CỘT TRÁI: ĐIỀU KHIỂN */}
          <div className="w-full lg:w-[350px] flex-shrink-0 bg-gray-50 lg:border-r border-b border-gray-200 p-5 flex flex-col overflow-y-auto max-h-[40%] lg:max-h-full">
            
            <div className="space-y-5 flex-1">
              {/* Lý do */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lý do đổi phòng</label>
                <select 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                >
                  <option value="0">Lỗi từ phía KTX (Hỏng hóc, sửa chữa)</option>
                  <option value="1">Yêu cầu cá nhân</option>
                  <option value="2">Lý do khác</option>
                </select>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú quản lý</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3} 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 resize-none"
                  placeholder="Nhập chi tiết..."
                />
              </div>

              {/* CARD TÓM TẮT CHI PHÍ (Ẩn trên mobile nếu chưa chọn phòng để tiết kiệm chỗ, hoặc hiện luôn cũng được) */}
              <div className={`rounded-xl border p-4 transition-all ${selectedRoom ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-100 border-dashed border-gray-300'}`}>
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 mb-3">Tạm tính chi phí</h3>

                {selectedRoom ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số ngày còn lại:</span>
                      <span className="font-medium">{remainingDays} ngày</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chênh lệch/ngày:</span>
                      <span>{formatCurrency(dailyNewPrice - dailyOldPrice)}</span>
                    </div>
                    
                    <div className="border-t border-dashed my-2 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Tổng cộng {isCharge ? 'thu thêm' : 'hoàn trả'}:</span>
                        <span className={`font-bold ${isCharge ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(diffAmount))}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">
                        {reason === "0" 
                          ? "*Đã bao gồm hỗ trợ 50% tiền phòng cũ do lỗi KTX" 
                          : "*Tính dựa trên chênh lệch giá phòng đến hết hợp đồng"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-6 text-sm italic">Chọn phòng để xem phí</div>
                )}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={!selectedRoom}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95
                  ${selectedRoom 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                {selectedRoom && isCharge ? <BanknotesIcon className="w-5 h-5"/> : <CheckCircleIcon className="w-5 h-5"/>}
                {selectedRoom 
                  ? (isCharge ? 'Thanh toán & Đổi' : 'Xác nhận Đổi') 
                  : 'Vui lòng chọn phòng'}
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: DANH SÁCH PHÒNG */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Search */}
            <div className="p-4 border-b border-gray-100 shrink-0">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm phòng trống (VD: A.101)..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Grid Phòng */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredRooms.map((room) => {
                  const isSelected = selectedRoom?.roomID === room.roomID;
                  const availableSlots = room.availableBeds;
                  const isFull = room.availableBeds <= 0;

                  return (
                    <div 
                      key={room.roomID}
                      onClick={() => !isFull && setSelectedRoom(room)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all cursor-pointer bg-white group
                        ${isFull ? 'opacity-60 cursor-not-allowed border-gray-100 bg-gray-50' : 'hover:border-blue-300 hover:shadow-md'}
                        ${isSelected ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/50' : 'border-transparent shadow-sm'}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-blue-600">
                          <CheckCircleSolid className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-lg ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                          {room.roomName}
                        </h4>
                        {!isSelected && (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border
                            ${isFull 
                                ? 'bg-red-50 text-red-700 border-red-100' 
                                : 'bg-green-50 text-green-700 border-green-100'}
                            `}>
                            {isFull ? 'Đã đầy' : `Còn ${availableSlots} chỗ`}
                            </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <p>{room.roomType}</p>
                        <p className="font-semibold text-gray-700">
                          {formatCurrency(room.price)} <span className="font-normal text-gray-400">/năm</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredRooms.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
                  <ExclamationCircleIcon className="w-12 h-12 mb-2 opacity-20" />
                  <p>Không tìm thấy phòng phù hợp</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomChangeModal;