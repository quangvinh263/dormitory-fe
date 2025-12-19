import Section from '../../shared/Section';
import Badge from '../../ui/Badge';

export default function EquipmentList({ equipments }) {
  return (
    <Section className="animate-fade-in-up delay-200">
      <div className="mb-6">
         <h3 className="font-bold text-gray-900">Trang Thiết Bị Phòng</h3>
         <p className="text-sm text-gray-500">Danh sách trang thiết bị và tình trạng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {equipments.map((item, index) => (
           <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                 <p className="font-bold text-gray-900">{item.name}</p>
                 <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              </div>
              <Badge type={item.status === 'Tốt' ? 'success' : 'warning'} className="px-4 py-1.5 text-sm">
                 {item.status}
              </Badge>
           </div>
         ))}
      </div>
    </Section>
  );
}