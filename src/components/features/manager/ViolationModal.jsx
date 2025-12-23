import React, { useState, useEffect, useMemo } from 'react'; 
import { XMarkIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ViolationModal = ({ isOpen, onClose, onSubmit, mode = 'create', initialData, allViolations = [] }) => {
  
  // State mặc định
  const defaultState = {
    studentId: '', 
    room: '',
    violationType: '',
    description: '',
    resolution: '' 
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (isOpen) {
        if (initialData && mode !== 'create') {
            setFormData({
                studentId: initialData.studentId || '',
                room: initialData.room || '',
                violationType: initialData.type || '', 
                description: initialData.description || '',
                resolution: initialData.resolution || ''
            });
        } else {
            setFormData(defaultState);
        }
    }
  }, [isOpen, initialData, mode]);

  // Biến kiểm tra chế độ
  const isCreate = mode === 'create';
  const isView = mode === 'view';
  const isUpdate = mode === 'update';

  // [LOGIC] Lọc lịch sử vi phạm
  const history = useMemo(() => {
    if (!formData.studentId) return [];
    
    // Tìm các lỗi cũ của SV này (trừ lỗi đang xem hiện tại)
    return allViolations.filter(v => 
      v.studentId === formData.studentId && 
      (initialData ? v.id !== initialData.id : true) 
    );
  }, [allViolations, formData.studentId, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, mode); 
    onClose();
  };

  const getTitle = () => {
    if (isCreate) return "Lập Biên Bản Vi Phạm";
    if (isUpdate) return "Cập Nhật Xử Lý Vi Phạm";
    return "Chi Tiết Vi Phạm";
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {isView ? "Xem thông tin chi tiết biên bản" : "Nhập thông tin vi phạm và hướng xử lý"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container */}
        <div className="p-5 space-y-6">
            
            {/* [UI MỚI] PHẦN HIỂN THỊ LỊCH SỬ (Chỉ hiện khi có lịch sử) */}
            {history.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-3">
                        <ClockIcon className="w-5 h-5 text-orange-600" />
                        <h4 className="font-bold text-orange-800 text-sm">
                            Lịch sử vi phạm trước đây ({history.length} lần)
                        </h4>
                    </div>
                    
                    <div className="bg-white rounded border border-orange-200 overflow-hidden">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-orange-100 text-orange-800 font-semibold">
                                <tr>
                                    <th className="p-2">Ngày</th>
                                    <th className="p-2">Lỗi</th>
                                    <th className="p-2">Xử lý</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-2 text-gray-500">{item.date}</td>
                                        <td className="p-2 font-medium text-gray-800">{item.type}</td>
                                        <td className="p-2 text-gray-500 truncate max-w-[150px]">
                                            {item.resolution || "Chưa xử lý"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Form Chính */}
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Hàng 1: MSSV và Phòng */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">MSSV {!isView && <span className="text-red-500">*</span>}</label>
                <input 
                    type="text" 
                    value={formData.studentId}
                    disabled={!isCreate}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${!isCreate ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                    placeholder="Nhập MSSV"
                />
                </div>
                <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phòng {!isView && <span className="text-red-500">*</span>}</label>
                <input 
                    type="text" 
                    value={formData.room}
                    disabled={!isCreate}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${!isCreate ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                    placeholder="Số phòng"
                />
                </div>
            </div>

            {/* Hàng 2: Loại vi phạm  */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Loại vi phạm {!isView && <span className="text-red-500">*</span>}</label>
                <input
                type="text"
                value={formData.violationType}
                disabled={!isCreate}
                onChange={(e) => setFormData({...formData, violationType: e.target.value})}
                className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${!isCreate ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                placeholder="Loại vi phạm"
                />
            </div>

            {/* Hàng 3: Mô tả vi phạm  */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Mô tả vi phạm {!isView && <span className="text-red-500">*</span>}</label>
                <textarea 
                rows="3"
                value={formData.description}
                disabled={!isCreate}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                    ${!isCreate ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                placeholder="Mô tả chi tiết hành vi vi phạm..."
                ></textarea>
            </div>

            {/* Hàng 4: NỘI DUNG XỬ LÝ  */}
            <div className="animate-fade-in-up">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Nội dung xử lý {isUpdate && <span className="text-red-500">*</span>}
                </label>
                <textarea 
                    rows="3"
                    value={formData.resolution}
                    disabled={isView} 
                    autoFocus={isUpdate} 
                    onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                    className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                    ${isView ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white border-blue-500 ring-1 ring-blue-500'}`} 
                    placeholder={isCreate ? "Chưa có nội dung xử lý..." : "Nhập hình thức xử lý, kỷ luật..."}
                ></textarea>
            </div>

            {/* Note cảnh báo */}
            <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-md p-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-700 flex-shrink-0" />
                <p className="text-sm text-gray-500 leading-tight">
                Sinh viên sẽ nhận được thông báo ngay sau khi biên bản được cập nhật.
                <span className="font-semibold text-gray-700"> Vi phạm lần thứ 3 sẽ tự động chấm dứt hợp đồng.</span>
                </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end items-center gap-3 pt-2">
                <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                {isView ? "Đóng" : "Hủy"}
                </button>
                
                {!isView && (
                    <button 
                    type="submit" 
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm flex items-center gap-2 transition-colors bg-blue-600 hover:bg-blue-700`}
                    >
                    <span>{isUpdate ? "Cập nhật xử lý" : "Lập biên bản"}</span>
                    </button>
                )}
            </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default ViolationModal;