import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ViolationRulesCard() {
  const rules = [
    'Giữ vệ sinh phòng ở và khu vực chung',
    'Không gây ồn sau 22h00',
    'Không sử dụng thiết bị điện công suất lớn (bếp điện, lò sưởi...)',
    'Đăng ký khách trước khi cho qua đêm',
    'Tham gia đầy đủ các buổi kiểm tra vệ sinh định kỳ'
  ];

  return (
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
       <div className="flex items-center gap-2 mb-4">
          <InformationCircleIcon className="w-6 h-6 text-blue-600"/>
          <h3 className="font-bold text-gray-900 text-lg">Một số quy định cần nhớ:</h3>
       </div>
       
       <ul className="space-y-3">
          {rules.map((rule, index) => (
             <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                <span className="text-sm md:text-base">{rule}</span>
             </li>
          ))}
       </ul>
    </div>
  );
}