import Section from '../../shared/Section';
import Select from '../../ui/Select'; 

export default function RoomFilters({ filters, onChange }) {
  // Helper để wrap việc gọi onChange cho gọn
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <Section className="mb-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Lọc theo Tòa */}
        <Select 
            label="Khu vực / Tòa nhà" 
            name="building"
            value={filters.building}
            onChange={handleChange}
        >
              <option value="all">Tất cả khu vực</option>
              <option value="A">Tòa A (Nam)</option>
              <option value="B">Tòa B (Nữ)</option>
              <option value="C">Tòa C (Dịch vụ)</option>
        </Select>

        {/* Lọc theo Loại phòng */}
        <Select 
            label="Loại phòng" 
            name="type"
            value={filters.type}
            onChange={handleChange}
        >
              <option value="all">Tất cả loại phòng</option>
              <option value="8">Phòng 8 người (Phổ thông)</option>
              <option value="6">Phòng 6 người (Tiêu chuẩn)</option>
              <option value="4">Phòng 4 người (Chất lượng cao)</option>
              <option value="2">Phòng 2 người (Dịch vụ)</option>
        </Select>

        {/* Lọc theo Giá */}
        <Select 
            label="Mức giá (VNĐ/năm)" 
            name="priceRange"
            value={filters.priceRange}
            onChange={handleChange}
        >
              <option value="all">Mọi mức giá</option>
              <option value="low">Dưới 500.000đ</option>
              <option value="medium">500.000đ - 1.000.000đ</option>
              <option value="high">Trên 1.000.000đ</option>
        </Select>

      </div>
    </Section>
  );
}