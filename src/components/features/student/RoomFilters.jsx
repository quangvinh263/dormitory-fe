import Section from '../../shared/Section';
import Select from '../../ui/Select'; 
import Input from '../../ui/Input'; // Thêm nếu chưa có
import { FunnelIcon } from '@heroicons/react/24/outline';

export default function RoomFilters({ filters, onChange, buildings = [], roomTypes = [], loading = false }) {
  // Helper để wrap việc gọi onChange cho gọn
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <Section className="mb-6 animate-fade-in-up">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h2>
          {loading && <span className="text-sm text-gray-500">(Đang tải...)</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Lọc theo Tòa */}
          <Select 
              label="Khu vực / Tòa nhà" 
              name="building"
              value={filters.building}
              onChange={handleChange}
              disabled={loading}
          >
                <option value="all">Tất cả khu vực</option>
                {buildings.map((building) => (
                  <option key={building.buildingID} value={building.buildingID}>
                    {building.buildingName}
                  </option>
                ))}
          </Select>

          {/* Lọc theo Loại phòng */}
          <Select 
              label="Loại phòng" 
              name="type"
              value={filters.type}
              onChange={handleChange}
              disabled={loading}
          >
                <option value="all">Tất cả loại phòng</option>
                {roomTypes.map((roomType) => (
                  <option key={roomType.roomTypeID} value={roomType.roomTypeID}>
                    {roomType.typeName}
                  </option>
                ))}
          </Select>

          {/* Lọc theo Giá */}
          <Select 
              label="Mức giá (VNĐ/năm)" 
              name="priceRange"
              value={filters.priceRange}
              onChange={handleChange}
              disabled={loading}
          >
                <option value="all">Mọi mức giá</option>
                <option value="low">Dưới 1 triệu</option>
                <option value="medium">1-2 triệu</option>
                <option value="high">Trên 2 triệu</option>
          </Select>

          {/* Lọc theo tầng */}
          <Input
            label="Tầng"
            name="floor"
            type="number"
            placeholder="Nhập số tầng"
            value={filters.floor || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
    </Section>
  );
}