import { useState, useEffect,useContext } from 'react'
import { useNavigate,useSearchParams} from 'react-router-dom'
import { WrenchIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

// Import Modules
import RequestStats from '../../components/features/student/RequestStats';
import RequestItem from '../../components/features/student/RequestItem';
import CreateRequestModal from '../../components/features/student/CreateRequestModal';
import RequestDetailModal from '../../components/features/student/RequestDetailModal';

import {getMaintenances} from '../../services/maintenanceApi'
import { getStudentInfo } from '../../services/studentApi'
import { AuthContext } from '../../context/AuthContext'

export default function Maintenance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { auth } = useContext(AuthContext);


  const [requests,setRequests] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  
  useEffect(() => {
        let mounted = true;
        const accountId = auth?.accountId || localStorage.getItem('accountId');

        if (!accountId) {
          setError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        const fetchData = async () => {
            try {
                const stuRes = await getStudentInfo(accountId);
                if (!mounted) return;

                if (!stuRes.success || !stuRes.data) {
                    throw new Error(stuRes.message || 'Không thể lấy thông tin sinh viên');
                }
                const sId = stuRes.data.studentID || stuRes.data.studentId || stuRes.data.id;
                setStudentId(sId);
                
                const params = { studentId: studentId };
                const res = await getMaintenances(params);

                if (!mounted) return;

                if (res.success) {
                    setRequests(Array.isArray(res.data) ? res.data : []);
                } else {
                    throw new Error(res.message || 'Không thể tải danh sách yêu cầu.');
                }

            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => { mounted = false; };
    }, [auth]);
  // Tính toán số liệu thống kê
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    done: requests.filter(r => r.status === 'completed').length,
  };

  const handleCreateRequest = (newData) => {
    const newRequest = {
      id: Date.now(),
      code: `MNT_00${requests.length + 1}`,
      status: 'pending',
      room: newData.room,
      device: newData.device,
      description: newData.description,
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
      cost: 0
    };

    requests([newRequest, ...requests]);
    setIsCreateModalOpen(false); // Đóng modal sau khi tạo xong
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Module Thống kê */}
      <RequestStats stats={stats} />

      {/* 2. Main Content Wrapper */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         
         {/* Header của List */}
         <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-lg font-bold text-gray-900">Yêu Cầu Sửa Chữa Phòng</h2>
               <p className="text-sm text-gray-500 mt-1">Tạo và theo dõi tiến độ xử lý các sự cố kỹ thuật</p>
            </div>
            
            <Button size="sm" icon={<WrenchIcon className="w-4 h-4"/>} onClick={() => setIsCreateModalOpen(true)}>
               Tạo yêu cầu mới
            </Button>
         </div>

         {/* Danh sách Items */}
         <div className="p-4 bg-gray-50 min-h-[400px]">
            <div className="space-y-3">
               {requests.map((req) => (
                  <div key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer">
                     <RequestItem request={req} />
                  </div>
               ))}
            </div>
         </div>

      </div>
      
      <CreateRequestModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateRequest}
      />

      <RequestDetailModal
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />

    </div>
  );
}