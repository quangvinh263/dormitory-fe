import React, { useState } from 'react';
import { WrenchScrewdriverIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Section from '../../shared/Section'; 
import Button from '../../ui/Button';

// Import Modal từ file vừa tách
import ViolationDetailModal from './ViolationDetailModal';
import MaintenceDetailModal from './MaintenceDetailModal';

export default function OperationalPanel() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock Data
  const violationData = [
    {
      id: 'SV02',
      name: 'Trần Văn B',
      room: '102',
      violationCount: 2,
      violations: [
        {
          title: 'Gây ồn ào quá giờ',
          date: '20/12/2024',
          time: '23:45',
          description: 'Hát karaoke loa kẹo kéo gây ảnh hưởng phòng bên cạnh dù đã được nhắc nhở.',
          reporter: 'Nguyễn Văn A (Trưởng tòa)'
        },
        {
          title: 'Hút thuốc trong phòng',
          date: '10/11/2024',
          time: '20:15',
          description: 'Hút thuốc lá trong phòng máy lạnh, vi phạm quy định PCCC.',
          reporter: 'Nguyễn Văn A (Trưởng tòa)'
        }
      ]
    },
    {
      id: 'SV05',
      name: 'Lê Thị C',
      room: '201',
      violationCount: 1,
      violations: [
        {
          title: 'Nấu ăn trong phòng',
          date: '18/12/2024',
          time: '18:30',
          description: 'Sử dụng bếp gas mini nấu lẩu trong phòng ở.',
          reporter: 'Trần Thị M (QL KTX)'
        }
      ]
    }
  ];

  const repairRequests = [
    { 
      RequestID: 'REQ001',
      StudentID: 'SV2021001',
      RoomID: '305', 
      EquipmentID: 'EQ_AC_01 (Máy lạnh)', 
      Description: 'Máy kêu to và chảy nước xuống giường', 
      RequestDate: '2025-12-23 08:30:00', 
      ResolvedDate: null,
      Status: 'Pending',
      RepairCost: 0,
      ManagerNote: ''
    },
    { 
      RequestID: 'REQ002',
      StudentID: 'SV2021055',
      RoomID: '102', 
      EquipmentID: 'EQ_LIGHT_05 (Bóng đèn)', 
      Description: 'Cháy bóng đèn chính trong nhà vệ sinh', 
      RequestDate: '2025-12-22 14:00:00', 
      ResolvedDate: null,
      Status: 'Processing', // Đang sửa -> Click vào sẽ hiện form nhập Cost
      RepairCost: 0,
      ManagerNote: 'Đã gọi thợ điện, hẹn chiều nay đến.'
    },
    { 
      RequestID: 'REQ003',
      StudentID: 'SV2021099',
      RoomID: '204', 
      EquipmentID: 'EQ_BED_02 (Giường tầng)', 
      Description: 'Gãy thanh chắn giường tầng 2, nguy hiểm', 
      RequestDate: '2025-12-20 09:00:00', 
      ResolvedDate: '2025-12-21 10:00:00',
      Status: 'Done', 
      RepairCost: 150000,
      ManagerNote: 'Đã hàn lại thanh chắn.'
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. SỔ ĐEN VI PHẠM */}
        <Section title="Sổ Đen Vi Phạm">
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
                {violationData.map((student) => (
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
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 2. YÊU CẦU SỬA CHỮA */}
        <Section title="Yêu Cầu Sửa Chữa & Vệ Sinh Mới Nhất">
          <div className="space-y-3">
            {repairRequests.map((item, index) => (
              <div key={index} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 mb-2 sm:mb-0">
                  <div className={`p-2 rounded-full shrink-0 ${item.Status === 'Pending' ? 'bg-red-50 text-red-500' : (item.Status === 'Processing' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600')}`}>
                    <WrenchScrewdriverIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">P.{item.RoomID}</span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="font-medium text-gray-700 text-sm">{item.EquipmentID.split('(')[0]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.Description}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{item.RequestDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.Status === 'Pending' && <span className="bg-red-100 text-red-700 text-[12px] px-2 py-1 rounded-full font-bold ">Chờ xử lý</span>}
                  {item.Status === 'Processing' && <span className="bg-yellow-100 text-yellow-700 text-[12px] px-2 py-1 rounded-full font-bold">Đang sửa</span>}
                  {item.Status === 'Done' && <span className="bg-green-100 text-green-700 text-[12px] px-2 py-1 rounded-full font-bold">Hoàn thành</span>}
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