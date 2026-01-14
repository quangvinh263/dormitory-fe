import React, { useState, useEffect, useMemo } from 'react'; 
import { XMarkIcon, ExclamationTriangleIcon, ClockIcon, EyeIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getContractsByStudentId } from '../../../services/reportApi';

const ViolationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  mode = 'create', 
  initialData, 
  allViolations = [], 
  updateLoading = false,
  createLoading = false,
  deleteLoading = false 
}) => {
  
  // State mặc định
  const defaultState = {
    studentId: '', 
    room: '',
    violationType: '',
    description: '',
    resolution: '' 
  };

  const [formData, setFormData] = useState(defaultState);
  
  // State cho modal lịch sử
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryViolation, setSelectedHistoryViolation] = useState(null);

  // State cho thông tin sinh viên
  const [studentInfo, setStudentInfo] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [studentError, setStudentError] = useState('');

  // Biến kiểm tra chế độ (phải khai báo trước khi dùng trong useEffect)
  const isCreate = mode === 'create';
  const isView = mode === 'view';
  const isUpdate = mode === 'update';
  const isLoading = updateLoading || createLoading || deleteLoading;

  // Hàm chuyển đổi trạng thái hợp đồng từ tiếng Anh sang tiếng Việt
  const translateContractStatus = (status) => {
    const statusMap = {
      'Active': 'Đang hiệu lực',
      'Expired': 'Hết hạn',
      'Terminated': 'Đã chấm dứt',
      'Pending': 'Chờ xử lý',
      'Cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

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
            setStudentInfo(null);
            setStudentError('');
        }
    }
  }, [isOpen, initialData, mode]);

  // Effect để tìm thông tin sinh viên khi nhập MSSV (chỉ ở chế độ create)
  useEffect(() => {
    if (!isCreate || !formData.studentId || formData.studentId.trim() === '') {
      setStudentInfo(null);
      setStudentError('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoadingStudent(true);
        setStudentError('');
        
        const result = await getContractsByStudentId(formData.studentId);
        
        if (!result.success || !result.data || result.data.length === 0) {
          setStudentError('Không tìm thấy thông tin sinh viên');
          setStudentInfo(null);
          return;
        }

        // Lấy hợp đồng gần nhất (đang active hoặc mới nhất)
        const activeContract = result.data.find(contract => 
          contract.contractStatus === 'Active' || contract.contractStatus === 'Đang hiệu lực'
        );
        const latestContract = activeContract || result.data[0];

        setStudentInfo({
          studentName: latestContract.studentName || 'N/A',
          roomName: latestContract.roomName || 'N/A',
          contractStatus: translateContractStatus(latestContract.contractStatus) || 'N/A'
        });
        setStudentError('');
        
      } catch (error) {
        setStudentError('Lỗi khi tải thông tin sinh viên');
        setStudentInfo(null);
      } finally {
        setLoadingStudent(false);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.studentId, isCreate]);

  // [LOGIC] Lọc lịch sử vi phạm
  const history = useMemo(() => {
    if (!formData.studentId) return [];
    
    // Tìm các lỗi cũ của SV này (trừ lỗi đang xem hiện tại)
    return allViolations.filter(v => 
      v.studentId === formData.studentId && 
      (initialData ? v.id !== initialData.id : true) 
    );
  }, [allViolations, formData.studentId, initialData]);

  // Xử lý click vào lỗi cũ
  const handleHistoryClick = (historyViolation) => {
    setSelectedHistoryViolation(historyViolation);
    setHistoryModalOpen(true);
  };

  // Đóng modal lịch sử
  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedHistoryViolation(null);
  };

  // Xử lý xóa vi phạm
  const handleDelete = () => {
    if (!onDelete || !initialData) return;
    
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa vi phạm này?\n\n' +
      'Hành động này sẽ giảm nhẹ cho sinh viên và có thể khôi phục hợp đồng nếu sinh viên đã bị chấm dứt hợp đồng do vi phạm.'
    );
    
    if (confirmDelete) {
      onDelete(initialData);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation cho create mode
    if (isCreate) {
      if (!formData.studentId || !formData.violationType || !formData.description) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc: MSSV, Loại vi phạm, và Mô tả vi phạm!');
        return;
      }
    }
    
    // Validation cho update mode
    if (isUpdate && (!formData.resolution || formData.resolution.trim() === '')) {
      alert('Vui lòng nhập nội dung xử lý!');
      return;
    }

    onSubmit(formData, mode); 
    
    // Không đóng modal ngay lập tức nếu đang loading (sẽ đóng sau khi API thành công)
    if (!isLoading) {
      onClose();
    }
  };

  const getTitle = () => {
    if (isCreate) return "Lập Biên Bản Vi Phạm";
    if (isUpdate) return "Cập Nhật Xử Lý Vi Phạm";
    return "Chi Tiết Vi Phạm";
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl animate-fade-in-up">
          
          {/* Header */}
          <div className="flex justify-between items-start p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {isView ? "Xem thông tin chi tiết biên bản" : 
                 isCreate ? "Nhập thông tin vi phạm để lập biên bản" :
                 "Nhập thông tin vi phạm và hướng xử lý"}
              </p>
            </div>
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
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
                                      <th className="p-2 w-16">Chi tiết</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {history.map((item) => (
                                      <tr key={item.id} className="hover:bg-gray-50">
                                          <td className="p-2 text-gray-500">{item.date}</td>
                                          <td className="p-2 font-medium text-gray-800">{item.type}</td>
                                          <td className="p-2 text-gray-500 truncate max-w-[150px]">
                                              {item.resolution || "Chưa xử lý"}
                                          </td>
                                          <td className="p-2">
                                              <button
                                                  onClick={() => handleHistoryClick(item)}
                                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                                                  title="Xem chi tiết vi phạm này"
                                              >
                                                  <EyeIcon className="w-4 h-4" />
                                              </button>
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
              
              {/* Hàng 1: MSSV (và Phòng nếu không phải create) */}
              <div className={isCreate ? "w-full" : "grid grid-cols-2 gap-4"}>
                  {/* MSSV */}
                  <div className={isCreate ? "w-full" : ""}>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      MSSV {isCreate && <span className="text-red-500">*</span>}
                    </label>
                    <input 
                        type="text" 
                        value={formData.studentId}
                        disabled={!isCreate || isLoading}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                        className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${!isCreate || isLoading ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                        placeholder="Nhập MSSV"
                        required={isCreate}
                    />
                    
                    {/* Hiển thị trạng thái loading/error/success khi tìm sinh viên */}
                    {isCreate && formData.studentId && (
                      <div className="mt-2">
                        {loadingStudent && (
                          <div className="flex items-center gap-2 text-blue-600 text-xs">
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tìm sinh viên...</span>
                          </div>
                        )}
                        
                        {!loadingStudent && studentError && (
                          <div className="text-red-600 text-xs flex items-center gap-1">
                            <ExclamationTriangleIcon className="w-3 h-3" />
                            <span>{studentError}</span>
                          </div>
                        )}
                        
                        {!loadingStudent && studentInfo && !studentError && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-1">
                            <div className="flex items-center gap-2 text-green-700 text-xs font-semibold mb-2">
                              <CheckCircleIcon className="w-4 h-4" />
                              <span>Tìm thấy sinh viên</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              <div><span className="font-semibold">Họ tên:</span> {studentInfo.studentName}</div>
                              <div><span className="font-semibold">Phòng:</span> {studentInfo.roomName}</div>
                              <div><span className="font-semibold">Trạng thái HĐ:</span> {studentInfo.contractStatus}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Phòng - chỉ hiện khi không phải create */}
                  {!isCreate && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phòng</label>
                      <input 
                          type="text" 
                          value={formData.room}
                          disabled={!isCreate || isLoading}
                          onChange={(e) => setFormData({...formData, room: e.target.value})}
                          className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${!isCreate || isLoading ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                          placeholder="Số phòng"
                      />
                    </div>
                  )}
              </div>

              {/* Hàng 2: Loại vi phạm  */}
              <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Loại vi phạm {isCreate && <span className="text-red-500">*</span>}
                  </label>
                  <input
                  type="text"
                  value={formData.violationType}
                  disabled={!isCreate || isLoading}
                  onChange={(e) => setFormData({...formData, violationType: e.target.value})}
                  className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${!isCreate || isLoading ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                  placeholder="VD: Nấu ăn trong phòng, Đi về trễ, Gây ồn..."
                  required={isCreate}
                  />
              </div>

              {/* Hàng 3: Mô tả vi phạm  */}
              <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Mô tả vi phạm {isCreate && <span className="text-red-500">*</span>}
                  </label>
                  <textarea 
                  rows="3"
                  value={formData.description}
                  disabled={!isCreate || isLoading}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                      ${!isCreate || isLoading ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'}`}
                  placeholder="Mô tả chi tiết hành vi vi phạm, thời gian, địa điểm..."
                  required={isCreate}
                  ></textarea>
              </div>

              {/* Hàng 4: NỘI DUNG XỬ LÝ - chỉ hiện khi không phải create */}
              {!isCreate && (
                <div className="animate-fade-in-up">
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                        Nội dung xử lý {isUpdate && <span className="text-red-500">*</span>}
                    </label>
                    <textarea 
                        rows="3"
                        value={formData.resolution}
                        disabled={isView || isLoading} 
                        autoFocus={isUpdate} 
                        onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                        className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                        ${isView || isLoading ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white border-blue-500 ring-1 ring-blue-500'}`} 
                        placeholder="Nhập hình thức xử lý, kỷ luật..."
                    ></textarea>
                </div>
              )}

              {/* Note cảnh báo */}
              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-md p-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-700 flex-shrink-0" />
                  <p className="text-sm text-gray-500 leading-tight">
                    {isCreate 
                      ? "Biên bản sẽ được tạo và sinh viên sẽ nhận được thông báo. Có thể cập nhật hướng xử lý sau khi lập biên bản."
                      : "Sinh viên sẽ nhận được thông báo ngay sau khi biên bản được cập nhật."
                    }
                    <span className="font-semibold text-gray-700"> Vi phạm lần thứ 3 sẽ tự động chấm dứt hợp đồng.</span>
                  </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between items-center gap-3 pt-2">
                  <div>
                    {/* Nút Xóa Vi Phạm - chỉ hiện khi không phải create mode */}
                    {!isCreate && onDelete && (
                      <button 
                        type="button" 
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang xóa...</span>
                          </>
                        ) : (
                          <>
                            <TrashIcon className="w-4 h-4" />
                            <span>Xóa vi phạm</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                    type="button" 
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                    {isView ? "Đóng" : "Hủy"}
                    </button>
                    
                    {!isView && (
                      <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm flex items-center gap-2 transition-colors 
                        ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {createLoading ? 'Đang tạo biên bản...' : 'Đang cập nhật...'}
                          </span>
                        </>
                      ) : (
                        <span>{isUpdate ? "Cập nhật xử lý" : "Lập biên bản"}</span>
                      )}
                      </button>
                  )}
              </div>
              </div>

              </form>
          </div>
        </div>
      </div>

      {/* Modal lịch sử vi phạm */}
      {historyModalOpen && selectedHistoryViolation && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-xl animate-fade-in-up">
            
            {/* Header Modal Lịch Sử */}
            <div className="flex justify-between items-start p-4 border-b border-gray-100 bg-orange-50">
              <div>
                <h3 className="text-lg font-bold text-orange-800">Chi Tiết Vi Phạm Cũ</h3>
                <p className="text-sm text-orange-600 mt-1">
                  Xem thông tin vi phạm đã xảy ra trước đây
                </p>
              </div>
              <button 
                onClick={handleCloseHistoryModal} 
                className="text-orange-400 hover:text-orange-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal Lịch Sử */}
            <div className="p-4 space-y-4">
              
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">MSSV</label>
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                    {selectedHistoryViolation.studentId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Phòng</label>
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                    {selectedHistoryViolation.room}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Thời gian vi phạm</label>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                  {selectedHistoryViolation.date}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Loại vi phạm</label>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                  {selectedHistoryViolation.type}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Mô tả vi phạm</label>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border min-h-[60px]">
                  {selectedHistoryViolation.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Nội dung xử lý</label>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border min-h-[60px]">
                  {selectedHistoryViolation.resolution || "Chưa có nội dung xử lý"}
                </div>
              </div>

              {/* Footer Modal Lịch Sử */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                {/* Nút Xóa Vi Phạm Cũ */}
                {onDelete && (
                  <button 
                    onClick={() => {
                      handleCloseHistoryModal();
                      onDelete(selectedHistoryViolation);
                    }}
                    disabled={deleteLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xóa...</span>
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-4 h-4" />
                        <span>Xóa vi phạm này</span>
                      </>
                    )}
                  </button>
                )}
                
                <button 
                  onClick={handleCloseHistoryModal}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViolationModal;