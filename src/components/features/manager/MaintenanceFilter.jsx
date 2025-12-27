import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Import Shared Components
import Section from '../../shared/Section'; 
import Input from '../..//ui/Input'; 
import Select from '../../ui/Select'; 
import Button from '../../ui/Button';
import { getAllEquipment } from '../../../services/equipmentApi'

export default function MaintenanceFilter() {
  const[equipments,setEquipments] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect( ()=>{
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try
      {
        const equipmentRes = await getAllEquipment();
        if (!mounted) return;
        if (equipmentRes.data)
        {
          setEquipments(Array.isArray(equipmentRes.data) ? equipmentRes.data : [])
        }
        console.log(equipments);
      }
      catch (error) {
        console.error("Lỗi tải dữ liệu thiết bị:", error);
      }
      finally 
      {
       if (mounted) setLoading(false);
      }
    }
    fetch();
  },[]);
  return (
    <Section className="mb-6">
      {/* Header Filter */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc tìm kiếm
        </div>
        <button className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer">
          <XMarkIcon className="w-3 h-3" /> Xóa bộ lọc
        </button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        {/* Search Input (Chiếm nhiều không gian hơn) */}
        <div className="lg:col-span-6">
          <Input 
            label="Tìm kiếm"
            placeholder="Tìm theo mã yêu cầu, phòng, sinh viên, thiết bị..." 
            icon={<MagnifyingGlassIcon className="w-4 h-4" />} 
          />
        </div>

        {/* Trạng thái */}
        <div className="lg:col-span-3">
          <Select label="Trạng thái">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận </option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="wait payment">Chờ thanh toán</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
          </Select>
        </div>

        {/* Thiết bị */}
        <div className="lg:col-span-3">
          <Select 
              label="Thiết bị"
              // Nhớ thêm props value và onChange vào đây nếu chưa có
              // value={filter.equipmentName}
              // onChange={(e) => setFilter({...filter, equipmentName: e.target.value})}
          >
            <option value="">Tất cả thiết bị</option>

            {/* Kiểm tra mảng tồn tại trước khi map để tránh lỗi null/undefined */}
            {equipments && equipments.length > 0 ? (
                equipments.map((item) => (
                    <option 
                        // key là bắt buộc trong React (dùng ID của thiết bị)
                        key={item.equipmentID || item.id} 
                        
                        // value là giá trị sẽ gửi đi khi chọn (có thể là ID hoặc Tên tùy API của bạn)
                        value={item.equipmentName} 
                    >
                        {/* Tên hiển thị ra màn hình */}
                        {item.equipmentName}
                    </option>
                ))
            ) : (
                // (Tùy chọn) Hiển thị nếu danh sách rỗng
                <option value="" disabled>Không có dữ liệu</option>
            )}
          </Select>
        </div>
      </div>
    </Section>
  );
}