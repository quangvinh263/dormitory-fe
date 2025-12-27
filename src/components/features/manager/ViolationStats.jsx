import React from 'react';
import { 
  ExclamationTriangleIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  ChartPieIcon 
} from '@heroicons/react/24/outline';

// Import Shared Component
import StatCard from '../../shared/StatCard';

export default function ViolationStats({ violations = [] }) {
  // Tính toán stats từ dữ liệu API
  const stats = React.useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Tổng số vi phạm
    const totalViolations = violations.length;
    
    // Vi phạm trong tháng này
    const thisMonthViolations = violations.filter(v => {
      if (v.originalData?.violationTime === '0001-01-01T00:00:00') return false;
      const violationDate = new Date(v.originalData?.violationTime);
      return violationDate.getMonth() === currentMonth && violationDate.getFullYear() === currentYear;
    }).length;
    
    // Vi phạm tháng trước
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthViolations = violations.filter(v => {
      if (v.originalData?.violationTime === '0001-01-01T00:00:00') return false;
      const violationDate = new Date(v.originalData?.violationTime);
      return violationDate.getMonth() === lastMonth && violationDate.getFullYear() === lastMonthYear;
    }).length;
    
    // Tính thay đổi so với tháng trước
    const monthChange = thisMonthViolations - lastMonthViolations;
    const monthChangeText = monthChange > 0 ? `+${monthChange}` : `${monthChange}`;
    
    // Đếm sinh viên có >= 2 vi phạm
    const studentViolationCount = new Map();
    violations.forEach(v => {
      const count = studentViolationCount.get(v.studentId) || 0;
      studentViolationCount.set(v.studentId, count + 1);
    });
    
    const criticalStudents = Array.from(studentViolationCount.values())
      .filter(count => count >= 2).length;
    
    return [
      { 
        label: 'Tổng vi phạm', 
        value: totalViolations.toString(), 
        subtext: 'Tất cả thời gian', 
        type: 'default',
        icon: <ClipboardDocumentCheckIcon className="w-6 h-6 text-gray-400"/>
      },
      { 
        label: 'Vi phạm tháng này', 
        value: thisMonthViolations.toString(), 
        subtext: `${monthChangeText} so với tháng trước`, 
        type: monthChange > 0 ? 'warning' : 'success',
        icon: <ExclamationTriangleIcon className="w-6 h-6 text-orange-400"/>
      },
      { 
        label: 'Sinh viên có ≥2 vi phạm', 
        value: criticalStudents.toString(), 
        subtext: 'Cần theo dõi', 
        type: 'danger',
        icon: <UserGroupIcon className="w-6 h-6 text-red-400"/>
      },
    ];
  }, [violations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="h-full">
          <StatCard
            title={stat.label}
            value={stat.value}
            subtext={stat.subtext}
            type={stat.type}
            icon={stat.icon}
          />
        </div>
      ))}
    </div>
  );
}