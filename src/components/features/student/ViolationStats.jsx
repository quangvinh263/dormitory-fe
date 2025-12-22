import Badge from '../../ui/Badge';

export default function ViolationStats({ count }) {
  const maxViolations = 3;
  const percentage = Math.min((count / maxViolations) * 100, 100);
  
  // Màu sắc dựa trên mức độ
  const getColor = () => {
     if(count === 0) return 'bg-green-600';
     if(count < 3) return 'bg-yellow-500';
     return 'bg-red-600';
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
       <div className="flex justify-between items-start mb-6">
          <div>
             <p className="text-sm text-gray-500 font-medium mb-1">Số lần vi phạm</p>
             <p className={`text-3xl font-bold ${count === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {count}/{maxViolations}
             </p>
          </div>
          
          <div className="text-right">
             <p className="text-sm text-gray-500 font-medium mb-2">Trạng thái</p>
             <Badge type={count === 0 ? 'success' : (count < 3 ? 'warning' : 'danger')}>
                {count === 0 ? 'Tốt' : (count < 3 ? 'Cảnh báo' : 'Nghiêm trọng')}
             </Badge>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
             className={`h-full rounded-full transition-all duration-500 ${getColor()}`} 
             style={{ width: `${percentage}%` }}
          ></div>
       </div>
       
       <p className="text-xs text-gray-500 italic">
          * Vi phạm {maxViolations} lần sẽ bị xem xét chấm dứt hợp đồng lưu trú.
       </p>
    </div>
  );
}