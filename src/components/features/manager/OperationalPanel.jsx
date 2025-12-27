import React, { useState, useEffect } from 'react';
import { WrenchScrewdriverIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Section from '../../shared/Section'; 
import Button from '../../ui/Button';

// Import Modal từ file vừa tách
import ViolationDetailModal from './ViolationDetailModal';
import MaintenceDetailModal from './MaintenceDetailModal';

// Import API
import { getViolationStatsForManager, getViolationsByStudent } from '../../../services/violationApi';
import { getMaintenances } from '../../../services/maintenanceApi';

export default function OperationalPanel() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // State cho violation data
  const [violationData, setViolationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accountId = localStorage.getItem('accountId');
  const [requests,setRequests]=useState([]);

  // Fetch violation data khi component mount
  useEffect(() => {
    const fetchViolationData = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getViolationStatsForManager(accountId);

        if (!result.success) {
          throw new Error(result.message || 'Không thể tải danh sách vi phạm');
        }

        const apiData = result.data || [];

        // Map dữ liệu API sang format hiển thị
        const mappedData = apiData.map(item => ({
          id: item.studentId,
          name: item.studentName,
          room: item.roomName,
          violationCount: item.totalViolations,
          violations: [] // Sẽ được load khi click xem chi tiết
        }));

        setViolationData(mappedData);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu vi phạm');
      } finally {
        setLoading(false);
      }
    };
    const fetchMaintenanceData = async () =>{
      setLoading(true);
      try
      {
        const payload ={
          keyword:'',
          status:'',
          equipmentName:''
        }
        const maintenanceRes = await getMaintenances(payload);
        if (maintenanceRes.success && maintenanceRes.data)
        {
          setRequests(maintenanceRes.data.slice(0,3))
        }
        else
        {
          console.log('Lỗi không thể tải bảo trì');
          return;
        }
      }
      catch (err)
      {
        console.log(err);
      }
    }
    if (accountId) {
      fetchViolationData();
      fetchMaintenanceData();
    }
  }, [accountId]);

  // Function để load chi tiết vi phạm của student
  const handleViewViolationDetail = async (student) => {
    try {
      const result = await getViolationsByStudent(student.id);
      
      if (result.success) {
        const violations = result.data.map(violation => ({
          title: violation.violationAct,
          date: new Date(violation.violationTime).toLocaleDateString('vi-VN'),
          time: new Date(violation.violationTime).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          description: violation.description,
          reporter: violation.reportingManagerName,
          resolution: violation.resolution
        }));

        // Update student với violations đã load
        const updatedStudent = {
          ...student,
          violations
        };

        setSelectedStudent(updatedStudent);
      } else {
        // Nếu không load được, vẫn hiện modal với violations rỗng
        setSelectedStudent(student);
      }
    } catch (err) {
      // Nếu có lỗi, vẫn hiện modal với violations rỗng
      setSelectedStudent(student);
    }
  };

  

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. SỔ ĐEN VI PHẠM */}
        <Section title="Sổ Đen Vi Phạm">
          {loading && (
            <div className="text-center py-4 text-gray-500">
              Đang tải dữ liệu vi phạm...
            </div>
          )}
          
          {error && (
            <div className="text-center py-4 text-red-500">
              Lỗi: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-sm text-gray-700 bg-sky-100">
                  <tr>
                    <th className="px-3 py-2">Sinh viên</th>
                    <th className="px-3 py-2">Phòng</th>
                    <th className="px-3 py-2">Vi phạm</th>
                    <th className="px-3 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {violationData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-3 py-6 text-center text-gray-500">
                        Không có dữ liệu vi phạm
                      </td>
                    </tr>
                  ) : (
                    violationData.map((student) => (
                      <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">
                          {student.name} <span className="text-gray-400 font-normal">({student.id})</span>
                        </td>
                        <td className="px-3 py-3">{student.room}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              student.violationCount >= 2 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {student.violationCount}/3 lần
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <Button
                            onClick={() => handleViewViolationDetail(student)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* 2. YÊU CẦU SỬA CHỮA */}
        <Section title="Yêu Cầu Sửa Chữa & Vệ Sinh Đang Chờ Xác Nhận Mới Nhất">
          <div className="space-y-3">
            {requests.map((item, index) => (
              <div key={index} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 mb-2 sm:mb-0">
                  <div className={`p-2 rounded-full shrink-0 ${item.status === 'Pending' ? 'bg-red-50 text-red-500' : (item.status === 'Processing' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600')}`}>
                    <WrenchScrewdriverIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">P.{item.roomName}</span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="font-medium text-gray-700 text-sm">{item.equipmentName.split('(')[0]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{item.issueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.status === 'Pending' && <span className="bg-red-100 text-red-700 text-[12px] px-2 py-1 rounded-full font-bold ">Chờ xử lý</span>}
                  {item.status === 'Processing' && <span className="bg-yellow-100 text-yellow-700 text-[12px] px-2 py-1 rounded-full font-bold">Đang sửa</span>}
                  {item.status === 'Completed' && <span className="bg-green-100 text-green-700 text-[12px] px-2 py-1 rounded-full font-bold">Hoàn thành</span>}
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết" onClick={() => setSelectedRequest(item)}>
                     <ExclamationCircleIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* RENDER MODAL TỪ MODULE ĐÃ TÁCH */}
      <ViolationDetailModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />

      <MaintenceDetailModal 
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
}