import { useState, useEffect } from 'react';
import ViolationStatusCard from '../../components/features/student/ViolationStatusCard';
import ViolationRulesCard from '../../components/features/student/ViolationRulesCard';
import ViolationStats from '../../components/features/student/ViolationStats';
import { getViolationsByStudentAccount } from '../../services/violationApi';

export default function Violations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const violationCount = violations.length;
  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        const response = await getViolationsByStudentAccount(accountId);
        console.log('API Response:', response);
        
        // Lấy data từ response và map sang format component cần
        const violationsData = response.data || [];
        const mappedViolations = violationsData.map(violation => ({
          id: violation.violationId,
          reason: violation.violationAct,
          date: new Date(violation.violationTime).toLocaleDateString('vi-VN'),
          description: violation.description,
          resolution: violation.resolution,
          reportingManager: violation.reportingManagerName
        }));
        
        setViolations(mappedViolations);
        setError(null);
      } catch (err) {
        console.error('Error fetching violations:', err);
        setError('Không thể tải dữ liệu vi phạm');
        setViolations([]);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchViolations();
    } else {
      setError('Không tìm thấy thông tin tài khoản');
      setLoading(false);
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="space-y-6 w-full mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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
                <h3 className="font-bold text-gray-900">Chi tiết vi phạm ({violationCount})</h3>
             </div>
             <div className="divide-y divide-gray-100">
                {violations.map((v) => (
                   <div key={v.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                         <div className="flex-1">
                            <p className="font-medium text-gray-900">{v.reason}</p>
                            <p className="text-sm text-gray-600 mt-1">{v.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                               <p className="text-xs text-gray-500">Ngày: {v.date}</p>
                               <p className="text-xs text-gray-500">Báo cáo bởi: {v.reportingManager}</p>
                            </div>
                         </div>
                         <span className={`px-2 py-1 text-xs rounded ${
                            v.resolution === 'Đang chờ' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-red-100 text-red-700'
                         }`}>
                            {v.resolution}
                         </span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       )}

    </div>
  );
}