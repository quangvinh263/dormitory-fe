import React, { useState, useEffect, useMemo } from 'react';
import Badge from '../../../ui/Badge';
import { getAvailableRooms, getEquipmentByRoom } from '../../../../services/roomAPI';

const EquipmentReport = () => {
  // --- 1. STATE ---
  const [allRooms, setAllRooms] = useState([]); // Chứa TOÀN BỘ phòng lấy từ API
  const [selectedBuilding, setSelectedBuilding] = useState(''); // Tòa đang chọn
  const [selectedRoomId, setSelectedRoomId] = useState('');     // Phòng đang chọn (để gửi đi tìm thiết bị)
  
  const [equipments, setEquipments] = useState([]); // Kết quả thiết bị
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // --- 2. GỌI API LẤY LIST PHÒNG (Chạy 1 lần khi mở trang) ---
  useEffect(() => {
    const fetchRooms = async () => {
        // Payload bắt buộc để lấy TẤT CẢ phòng
        const payload = {
            buildingId: null,
            roomTypeId: null,
            price: null,
            onlyAvailable: false // <--- QUAN TRỌNG: false để lấy cả phòng đầy
        };

        // 👇 Gọi hàm từ roomAPI thay vì axios trực tiếp
        const res = await getAvailableRooms(payload);

        if (res.success) {
            const rawData = res.data;

            // Logic tách Tòa từ tên phòng (vì API trả về chưa có field Building riêng)
            const processedData = rawData.map(room => ({
                ...room,
                // Lấy ký tự đầu: "A1.01" -> "A"
                extractedBuilding: room.roomName ? room.roomName.charAt(0).toUpperCase() : '?'
            }));

            setAllRooms(processedData);
        } else {
            console.error("Lỗi API:", res.message);
        }
    };

    fetchRooms();
  }, []);

  // --- 3. TẠO MENU TÒA NHÀ (Tự động) ---
  // Lọc ra danh sách các tòa duy nhất (A, B, C...) từ list phòng
  const buildings = useMemo(() => {
    const uniqueBuildings = [...new Set(allRooms.map(r => r.extractedBuilding))];
    return uniqueBuildings.sort();
  }, [allRooms]);

  // --- 4. TẠO MENU PHÒNG (Phụ thuộc vào Tòa đang chọn) ---
  const filteredRooms = useMemo(() => {
    if (!selectedBuilding) return [];
    return allRooms.filter(r => r.extractedBuilding === selectedBuilding);
  }, [allRooms, selectedBuilding]);


  // --- 5. XỬ LÝ TÌM KIẾM THIẾT BỊ ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) return;

    setLoading(true); // Bắt đầu loading
    setIsSearching(true);

    try {
        const res = await getEquipmentByRoom(selectedRoomId);
        if (res.success) {
            setEquipments(res.data);
        } else {
            setEquipments([]);
            console.error(res.message);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        setEquipments([]);
    } finally {
        setLoading(false); 
    }
  };
  // Helper render màu trạng thái
  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('tốt') || s.includes('good')) return <Badge type="success">{status}</Badge>;
    if (s.includes('hỏng') || s.includes('lỗi')) return <Badge type="danger">{status}</Badge>;
    return <Badge type="default">{status}</Badge>;
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      
      {/* THANH TÌM KIẾM */}
      <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
            <h3 className="font-bold text-gray-800 text-md">Tra cứu Thiết bị</h3>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
            
            {/* 1. SELECT TÒA NHÀ */}
            <select 
                value={selectedBuilding}
                onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setSelectedRoomId(''); // Reset phòng khi đổi tòa
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="">-- Chọn Tòa --</option>
                {buildings.map(b => (
                    <option key={b} value={b}>Tòa {b}</option>
                ))}
            </select>

            {/* 2. SELECT PHÒNG (Chỉ hiện phòng thuộc tòa đã chọn) */}
            <select 
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                disabled={!selectedBuilding} // Khóa nếu chưa chọn tòa
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
            >
                <option value="">-- Chọn Phòng --</option>
                {filteredRooms.map(r => (
                    // Lưu ý: r.roomID (hoặc r.RoomID tùy API trả về hoa/thường)
                    <option key={r.roomID} value={r.roomID}>{r.roomName}</option>
                ))}
            </select>

            <button 
                type="submit" 
                disabled={loading || !selectedRoomId}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? '...' : 'Xem'}
            </button>
        </form>
      </div>

      {/* TABLE HIỂN THỊ */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Mã thiết bị</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Tên thiết bị</th>
            <th className="px-6 py-3 text-center text-sm font-bold text-gray-500">Số lượng</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Vị trí</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Tình trạng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
           {!isSearching ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">Vui lòng chọn phòng để xem thiết bị.</td></tr>
           ) : loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
           ) : equipments.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Phòng này chưa có thiết bị nào.</td></tr>
           ) : (
              equipments.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-sm text-gray-900">{item.equipmentID}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.equipmentName}</td>
                    <td className="px-6 py-4 text-sm text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.roomName}</td>
                    <td className="px-6 py-4">{renderStatusBadge(item.status)}</td>
                </tr>
              ))
           )}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentReport;