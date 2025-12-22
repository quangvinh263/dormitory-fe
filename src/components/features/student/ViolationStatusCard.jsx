import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ViolationStatusCard({ violationCount }) {
  const isGood = violationCount === 0;

  return (
    <div className={`rounded-xl border p-6 flex flex-col gap-2 transition-all
      ${isGood 
        ? 'bg-green-50 border-green-200 text-green-900' 
        : 'bg-red-50 border-red-200 text-red-900'
      }`}
    >
      <div className="flex items-center gap-3 mb-1">
         {isGood ? (
            <CheckCircleIcon className="w-8 h-8 text-green-600"/>
         ) : (
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600"/>
         )}
         <h3 className="font-bold text-lg">
            {isGood ? 'Không Có Vi Phạm' : `Bạn có ${violationCount} lần vi phạm`}
         </h3>
      </div>
      
      <p className={`text-base ${isGood ? 'text-green-700' : 'text-red-700'}`}>
         {isGood 
           ? 'Chúc mừng! Bạn đang tuân thủ tốt các quy định của ký túc xá.' 
           : 'Vui lòng chú ý tuân thủ nội quy để tránh bị chấm dứt hợp đồng.'}
      </p>
      
      {isGood && (
         <p className="text-sm text-green-600 mt-1">
            Hãy tiếp tục duy trì để tạo môi trường sống tốt cho mọi người.
         </p>
      )}
    </div>
  );
}