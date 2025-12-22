import { useState } from 'react';
import ViolationStatusCard from '../../components/features/student/ViolationStatusCard';
import ViolationRulesCard from '../../components/features/student/ViolationRulesCard';
import ViolationStats from '../../components/features/student/ViolationStats';

// MOCK DATA
const MOCK_VIOLATIONS = [
  //{ id: 1, date: '10/12/2024', reason: 'Gây ồn ào sau 23h', status: 'confirmed' } 
  // Để trống để test trường hợp "Không vi phạm" giống thiết kế
];

export default function Violations() {
  const [violations] = useState(MOCK_VIOLATIONS);
  const violationCount = violations.length;

  return (
    <div className="space-y-6 w-full mx-auto">
       
       {/* Header */}
       <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo Dõi Vi Phạm</h1>
          <p className="text-gray-500 mt-1">Lịch sử tuân thủ nội quy ký túc xá của bạn</p>
       </div>

       {/* Module 1: Trạng thái tổng quan */}
       <ViolationStatusCard violationCount={violationCount} />

       {/* Module 2: Các quy định */}
       <ViolationRulesCard />

       {/* Module 3: Thống kê & Progress */}
       <ViolationStats count={violationCount} />

       {/* Module 4: Danh sách chi tiết (Nếu có) */}
       {violationCount > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Chi tiết vi phạm</h3>
             </div>
             <div className="divide-y divide-gray-100">
                {violations.map((v) => (
                   <div key={v.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                      <div>
                         <p className="font-medium text-gray-900">{v.reason}</p>
                         <p className="text-xs text-gray-500">{v.date}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Đã ghi nhận</span>
                   </div>
                ))}
             </div>
          </div>
       )}

    </div>
  );
}