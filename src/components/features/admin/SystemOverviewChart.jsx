import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import hàm API bạn đã cung cấp (nhớ kiểm tra đúng đường dẫn file)
import { getStatsBuildingForAdmin } from '../../../services/adminApi';

const SystemOverviewChart = () => {
  const navigate = useNavigate();
  
  // State lưu dữ liệu
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mảng màu sắc để gán cho từng tòa nhà (sẽ lặp lại nếu có nhiều hơn 5 tòa)
  const COLORS = [
    'bg-blue-500', 
    'bg-indigo-500', 
    'bg-purple-500', 
    'bg-pink-500', 
    'bg-teal-500'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getStatsBuildingForAdmin();
        
        if (result.success && Array.isArray(result.data)) {
          // Map dữ liệu từ API sang format mà UI cần
          // Giả sử API trả về các field: buildingName, occupancyRate, monthlyRevenue
          const mappedData = result.data.map((item, index) => ({
            name: item.buildingName,
            fill: item.occupancyRate, // % Lấp đầy
            // Chia cho 1 triệu để hiển thị gọn (VD: 120000000 -> 120)
            revenue: (item.monthlyRevenue / 1000000).toFixed(1), // Giữ 1 số thập phân nếu cần
            // Gán màu theo thứ tự index, dùng toán tử % để vòng lặp lại màu
            color: COLORS[index % COLORS.length]
          }));

          setBuildings(mappedData);
        }
      } catch (error) {
        console.error("Lỗi tải biểu đồ tòa nhà:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render Loading khi chưa có dữ liệu
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col items-center justify-center">
        <p className="text-gray-400 text-sm">Đang tải dữ liệu biểu đồ...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">Hiệu suất các Tòa nhà</h3>
        <p className="text-sm text-gray-500 mt-1">Tỷ lệ lấp đầy & Doanh thu ước tính tháng này</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        {buildings.length > 0 ? (
          buildings.map((b, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-800">{b.name}</span>
                <span className="text-gray-500">
                  Doanh thu: <span className="font-semibold text-gray-900">{b.revenue}tr</span>
                </span>
              </div>
              
              {/* Progress Bar đại diện Fill Rate */}
              <div className="w-full bg-gray-100 rounded-full h-4 relative overflow-hidden">
                <div 
                  className={`h-4 rounded-full ${b.color} transition-all duration-1000`} 
                  style={{ width: `${b.fill}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">
                  Lấp đầy {b.fill}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm">Không có dữ liệu tòa nhà nào.</p>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
        <button 
          onClick={() => navigate("/admin/reports")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Xem báo cáo chi tiết →
        </button>
      </div>
    </div>
  );
};

export default SystemOverviewChart;