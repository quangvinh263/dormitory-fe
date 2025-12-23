import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Import UI Components chung
import Section from '../../components/shared/Section';

// Import các Feature Components đã tách
import PersonalInfoSection from '../../components/features/student/PersonalInfoSection';
import RelativeListSection from '../../components/features/student/RelativeListSection';

// Import API
import { getStudentInfo } from '../../services/studentApi';
import { getSchoolInfo, getPriorityInfo } from '../../services/publicInforApi';

export default function StudentProfile() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);  // Đổi tên
  const [isEditingRelatives, setIsEditingRelatives] = useState(false); // Thêm mới
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    gender: '',
    email: '',
    phone: '',
    cccd: '',
    issuePlace: '',
    schoolId: '',      
    schoolName: '',    
    priorityId: '',    
    priorityName: '',  
    address: '',
    relatives: []
  });
  const [originalData, setOriginalData] = useState(null); // Lưu data gốc để reset
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho danh sách school và priority
  const [schools, setSchools] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Fetch student data khi component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const accountId = localStorage.getItem('accountId');
        
        if (!accountId) {
          setError('Không tìm thấy thông tin tài khoản');
          setLoading(false);
          return;
        }

        const result = await getStudentInfo(accountId);
        
        if (result.success && result.data) {
          const student = result.data;
          
          // Map API data sang formData
          const studentData = {
            fullName: student.fullName || '',
            studentId: student.studentID || '',
            gender: student.gender || '',
            email: student.email || '',
            phone: student.phoneNumber || '',
            cccd: student.citizenID || '',
            issuePlace: student.citizenIDIssuePlace || '',
            schoolName: student.schoolName || '',
            schoolId: '',
            priorityName: student.priorityName || '',
            priorityId: '',
            address: student.address || '',
            relatives: student.relatives || []
          };
          
          setFormData(studentData);
          setOriginalData(studentData); // Lưu bản gốc
        } else {
          setError(result.message || 'Không thể tải thông tin sinh viên');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Load schools và priorities khi bấm Edit Personal Info
  const handleEditPersonal = async () => {
    setIsEditingPersonal(true);
    setLoadingOptions(true);
    
    try {
      const [schoolResult, priorityResult] = await Promise.all([
        getSchoolInfo(),
        getPriorityInfo()
      ]);

      if (schoolResult.success) {
        setSchools(schoolResult.data);
        console.log('Schools loaded:', schoolResult.data);
        console.log('Looking for school:', formData.schoolName);
        
        const matchedSchool = schoolResult.data.find(s => {
          const schoolName = s.schoolName || s.SchoolName;
          return schoolName === formData.schoolName;
        });
        
        if (matchedSchool) {
          const schoolId = matchedSchool.schoolId || matchedSchool.SchoolId;
          console.log('Matched School ID:', schoolId);
          setFormData(prev => ({ ...prev, schoolId: String(schoolId) }));
        } else {
          console.warn('No matching school found for:', formData.schoolName);
        }
      } else {
        console.error('Failed to load schools:', schoolResult.message);
      }

      if (priorityResult.success) {
        setPriorities(priorityResult.data);
        console.log('Priorities loaded:', priorityResult.data);
        console.log('Looking for priority:', formData.priorityName);
        
        const matchedPriority = priorityResult.data.find(p => {
          const priorityName = p.priorityName || p.PriorityName;
          const priorityDesc = p.priorityDescription || p.PriorityDescription;
          return priorityName === formData.priorityName || 
                 priorityDesc === formData.priorityName;
        });
        
        if (matchedPriority) {
          const priorityId = matchedPriority.priorityID || matchedPriority.PriorityID;
          console.log('Matched Priority ID:', priorityId);
          setFormData(prev => ({ ...prev, priorityId: String(priorityId) }));
        } else {
          console.warn('No matching priority found for:', formData.priorityName);
        }
      } else {
        console.error('Failed to load priorities:', priorityResult.message);
      }
    } catch (error) {
      console.error('Error loading options:', error);
      alert('Không thể tải danh sách trường học và ưu tiên');
    } finally {
      setLoadingOptions(false);
    }
  };

  // Bật chế độ chỉnh sửa relatives
  const handleEditRelatives = () => {
    setIsEditingRelatives(true);
  };

  // --- LOGIC XỬ LÝ ---
  
  // 1. Xử lý sửa thông tin cá nhân
  const handleInfoChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Xử lý sửa thông tin người thân
  const handleRelativeChange = (index, field, value) => {
    const newRelatives = [...formData.relatives];
    newRelatives[index][field] = value;
    setFormData(prev => ({ ...prev, relatives: newRelatives }));
  };

  // 3. Các hành động khác
  const addRelative = () => {
    const newRelative = { 
      id: Date.now(), 
      name: '', 
      relation: '', 
      job: '', 
      phone: '', 
      address: '' 
    };
    setFormData(prev => ({ ...prev, relatives: [...prev.relatives, newRelative] }));
  };

  const removeRelative = (index) => {
    const newRelatives = formData.relatives.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, relatives: newRelatives }));
  };

  // Lưu thông tin cá nhân
  const handleSavePersonal = () => {
    console.log("Saving Personal Info...", {
      fullName: formData.fullName,
      phone: formData.phone,
      issuePlace: formData.issuePlace,
      schoolId: formData.schoolId,
      priorityId: formData.priorityId,
      address: formData.address
    });
    // TODO: Call API update personal info
    alert("Cập nhật thông tin cá nhân thành công!");
    setIsEditingPersonal(false);
  };

  // Hủy chỉnh sửa thông tin cá nhân
  const handleCancelPersonal = () => {
    if (originalData) {
      setFormData(prev => ({
        ...prev,
        fullName: originalData.fullName,
        phone: originalData.phone,
        issuePlace: originalData.issuePlace,
        schoolId: originalData.schoolId,
        schoolName: originalData.schoolName,
        priorityId: originalData.priorityId,
        priorityName: originalData.priorityName,
        address: originalData.address
      }));
    }
    setIsEditingPersonal(false);
  };

  // Lưu thông tin người thân
  const handleSaveRelatives = () => {
    console.log("Saving Relatives...", formData.relatives);
    // TODO: Call API update relatives
    alert("Cập nhật thông tin người thân thành công!");
    setIsEditingRelatives(false);
  };

  // Hủy chỉnh sửa người thân
  const handleCancelRelatives = () => {
    if (originalData) {
      setFormData(prev => ({
        ...prev,
        relatives: [...originalData.relatives]
      }));
    }
    setIsEditingRelatives(false);
  };

  // --- RENDER LOADING/ERROR ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-stone-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER GIAO DIỆN ---
  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header Link */}
      <div>
         <Link to="/student" className="inline-flex items-center text-base text-stone-800 hover:text-primary mb-2 pl-4">
           <ArrowLeftIcon className="w-4 h-4 mr-2"/> Quay lại 
         </Link>
      </div>

      {/* BLOCK 1: THÔNG TIN CÁ NHÂN */}
      <PersonalInfoSection 
        data={formData}
        isEditing={isEditingPersonal}
        onEdit={handleEditPersonal}
        onCancel={handleCancelPersonal}
        onSave={handleSavePersonal}
        onChange={handleInfoChange}
        schools={schools}
        priorities={priorities}
        loadingOptions={loadingOptions}
      />

      {/* BLOCK 2: DANH SÁCH NGƯỜI THÂN */}
      <RelativeListSection 
        relatives={formData.relatives}
        isEditing={isEditingRelatives}
        onEdit={handleEditRelatives}
        onCancel={handleCancelRelatives}
        onSave={handleSaveRelatives}
        onAdd={addRelative}
        onChange={handleRelativeChange}
        onRemove={removeRelative}
      />

      {/* BLOCK 3: LƯU Ý */}
      <Section className="bg-blue-50/50 border-blue-100">
         <h3 className="font-bold text-blue-800 text-sm mb-3">Lưu ý</h3>
         <ul className="list-disc pl-5 text-sm text-blue-700/80 space-y-2">
           <li>Các trường có dấu (*) là bắt buộc.</li>
           <li>Mã sinh viên và CCCD không thể chỉnh sửa sau khi đã xác thực.</li>
           <li>Vui lòng cập nhật số điện thoại người thân chính xác để nhà trường liên hệ khi cần thiết.</li>
           <li>Email phải đúng định dạng (ví dụ: example@email.com).</li>
           <li>Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số.</li>
           <li>Thay đổi sẽ có hiệu lực ngay sau khi lưu thành công.</li>
         </ul>
      </Section>
    </div>
  );
}