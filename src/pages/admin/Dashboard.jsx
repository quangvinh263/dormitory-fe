import { UserGroupIcon, BuildingOfficeIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import StatCard from '../../components/shared/StatCard';
import Section from '../../components/shared/Section';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng sinh viên" value="1,234" subtext="+12% tháng này" icon={<UserGroupIcon className="w-5 h-5"/>} />
        <StatCard title="Tổng số tòa" value="8" subtext="Hoạt động tốt" icon={<BuildingOfficeIcon className="w-5 h-5"/>} type="success" />
        <StatCard title="Doanh thu tháng" value="2.4 Tỷ" subtext="VNĐ" icon={<CurrencyDollarIcon className="w-5 h-5"/>} type="warning" />
        <StatCard title="Hiệu suất lấp đầy" value="87%" subtext="Còn 142 giường trống" icon={<ChartBarIcon className="w-5 h-5"/>} />
      </div>

      <Section title="Nhật Ký Hệ Thống">
        <p className="text-gray-500">Chưa có dữ liệu nhật ký.</p>
      </Section>
    </div>
  );
}