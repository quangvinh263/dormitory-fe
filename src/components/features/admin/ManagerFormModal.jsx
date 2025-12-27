import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  UserPlusIcon, 
  PencilSquareIcon,
  KeyIcon,               // Icon chìa khóa cho Account
  IdentificationIcon,    // Icon thẻ ID cho Profile
  EyeIcon,               // Xem pass
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

const ManagerFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: '',
    CitizenID: '',
    DateOfBirth: '',
    Address: '',
    Password: '', 
    ConfirmPassword :'',     
    BuildingId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          FullName: initialData.name || '',
          Email: initialData.email || '',
          PhoneNumber: initialData.phone || '',
          CitizenID: initialData.citizenId || '',
          DateOfBirth: initialData.dob || '',
          Address: initialData.address || '',
          BuildingId: initialData.building || '',
          Password: '',
          ConfirmPassword: ''
        });
      } else {
        // CREATE MODE: Reset form
        setFormData({
          FullName: '', Email: '', PhoneNumber: '', CitizenID: '', DateOfBirth: '', Address: '', Password: '', ConfirmPassword: '', BuildingId: ''
        });
      }
      setShowPassword(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.FullName || !formData.Email) {
      alert("Vui lòng điền các trường bắt buộc!");
      return;
    }
    // Nếu tạo mới thì bắt buộc phải có mật khẩu
    if (!initialData && !formData.Password) {
       alert("Vui lòng nhập mật khẩu khởi tạo cho tài khoản!");
       return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {isEditMode ? <PencilSquareIcon className="w-5 h-5 text-blue-600"/> : <UserPlusIcon className="w-5 h-5 text-blue-600"/>}
            {isEditMode ? 'Cập nhật hồ sơ Trưởng tòa' : 'Tạo tài khoản Trưởng tòa mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto bg-gray-50/30">
          <form id="manager-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* PHẦN 1: THÔNG TIN TÀI KHOẢN (ACCOUNT) */}
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <KeyIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-md">Thông tin đăng nhập</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Tên đăng nhập) <span className="text-red-500">*</span></label>
                        <input 
                            type="email" name="Email" value={formData.Email} onChange={handleChange} required 
                            disabled={isEditMode} // Không cho sửa email khi update (vì dính tới AccountID)
                            className={`w-full border-gray-300 rounded-lg text-sm p-2.5 border ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`} 
                            placeholder="manager@dorm.vn" 
                        />
                        {!isEditMode && <p className="text-xs text-gray-500 mt-1">Email này sẽ dùng để đăng nhập hệ thống.</p>}
                    </div>

                    {/* PASSWORD & CONFIRM PASSWORD (Chỉ hiện khi tạo mới) */}
                    {!isEditMode && (
                        <>
                            {/* Mật khẩu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu khởi tạo <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="Password" value={formData.Password} onChange={handleChange} required
                                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border pr-10" 
                                        placeholder="••••••••" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>

                            {/* 👇 3. Xác nhận mật khẩu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        name="ConfirmPassword" value={formData.ConfirmPassword} onChange={handleChange} required
                                        className={`w-full rounded-lg text-sm p-2.5 border pr-10 outline-none
                                            ${formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' // Báo đỏ khi không khớp
                                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                        placeholder="Nhập lại mật khẩu" 
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                    </button>
                                </div>
                                {/* Gợi ý nhỏ nếu sai */}
                                {formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* PHẦN 2: THÔNG TIN CÁ NHÂN (PROFILE) */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <IdentificationIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-md">Thông tin cá nhân</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                        <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} required
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border" placeholder="Nguyễn Văn A" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                        <input type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border" placeholder="09xxxxxxx" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CCCD / CMND</label>
                        <input type="text" name="CitizenID" value={formData.CitizenID} onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border" placeholder="12 số CCCD" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                        <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tòa nhà phụ trách</label>
                        <select name="BuildingId" value={formData.BuildingId} onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border bg-white">
                            <option value="">-- Chọn tòa nhà --</option>
                            <option value="Tòa A">Tòa A</option>
                            <option value="Tòa B">Tòa B</option>
                            <option value="Tòa C">Tòa C</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
                        <textarea name="Address" value={formData.Address} onChange={handleChange} rows="2"
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 border resize-none" placeholder="Số nhà, đường, phường/xã..." />
                    </div>
                </div>
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
            Hủy bỏ
          </button>
          <button type="submit" form="manager-form" 
            className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200`}>
            {isEditMode ? 'Lưu thay đổi' : 'Tạo tài khoản'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManagerFormModal;