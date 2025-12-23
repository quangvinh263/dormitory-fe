import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Import UI Components chung
import Section from '../../components/shared/Section';

// Import các Feature Components đã tách
import PersonalInfoSection from '../../components/features/student/PersonalInfoSection';
import RelativeListSection from '../../components/features/student/RelativeListSection';

// Import API
import { getStudentInfo, updateStudentInfo, createRelative, updateRelative, deleteRelative } from '../../services/studentApi';
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
          
          // Map relatives với relativeID đúng format
          const mappedRelatives = (student.relatives || []).map(rel => ({
            relativeID: rel.relativeID || rel.RelativeID || rel.id,
            fullName: rel.fullName || rel.FullName || '',
            relationship: rel.relationship || rel.Relationship || '',
            phoneNumber: rel.phoneNumber || rel.PhoneNumber || '',
            address: rel.address || rel.Address || '',
            occupation: rel.occupation || rel.Occupation || '',
            isNew: false  // Đánh dấu là relative cũ
          }));
          
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
            relatives: mappedRelatives
          };
          
          setFormData(studentData);
          setOriginalData(JSON.parse(JSON.stringify(studentData))); // Deep clone để tránh reference
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

  // Thêm người thân mới
  const addRelative = () => {
    const newRelative = { 
      id: `new_${Date.now()}`,
      fullName: '',           
      relationship: '',      
      occupation: '',         
      phoneNumber: '',        
      address: '',
      isNew: true
    };
    setFormData(prev => ({ ...prev, relatives: [...prev.relatives, newRelative] }));
    setIsEditingRelatives(true);
  };

  
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
  // Lưu thông tin cá nhân
  const handleSavePersonal = async () => {
    // Validate dữ liệu trước khi gửi
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số');
      return;
    }
    if (!formData.schoolId) {
      alert('Vui lòng chọn trường học');
      return;
    }

    try {
      setLoadingOptions(true); // Dùng loading để disable nút

      const updateData = {
        studentId: formData.studentId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        schoolId: formData.schoolId,
        priorityId: formData.priorityId || null,
        citizenIDIssuePlace: formData.issuePlace
      };


      const result = await updateStudentInfo(updateData);

      if (result.success) {
        
        window.location.reload(); 
        
        setIsEditingPersonal(false);
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin');
    } finally {
      setLoadingOptions(false);
    }
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
  const handleSaveRelatives = async () => {
    try {
      setLoadingOptions(true);

      const results = [];
      
      console.log('=== START SAVE RELATIVES ===');
      console.log('Current relatives:', formData.relatives);
      console.log('Original relatives:', originalData?.relatives);
      
      for (let i = 0; i < formData.relatives.length; i++) {
        const relative = formData.relatives[i];
        
        console.log(`\n--- Processing Relative ${i + 1} ---`);
        console.log('Relative data:', relative);
        console.log('Is new?', relative.isNew);
        
        // Validate dữ liệu
        if (!relative.fullName?.trim()) {
          alert(`Vui lòng nhập tên người thân thứ ${i + 1}`);
          setLoadingOptions(false);
          return;
        }
        if (!relative.relationship?.trim()) {
          alert(`Vui lòng nhập quan hệ với người thân thứ ${i + 1}`);
          setLoadingOptions(false);
          return;
        }
        if (!relative.phoneNumber?.trim()) {
          alert(`Vui lòng nhập số điện thoại người thân thứ ${i + 1}`);
          setLoadingOptions(false);
          return;
        }
        if (!/^0\d{9}$/.test(relative.phoneNumber)) {
          alert(`Số điện thoại người thân thứ ${i + 1} phải bắt đầu bằng 0 và có 10 chữ số`);
          setLoadingOptions(false);
          return;
        }

        // Nếu là relative mới → Create
        if (relative.isNew === true) {
          console.log('👉 ACTION: CREATE');
          const result = await createRelative(relative, formData.studentId);
          
          if (result.success) {
            console.error('❌ Create failed:', result.message);
          }
          
          results.push({ type: 'create', result });
        }
        // Nếu là relative cũ → Check thay đổi và Update
        else {
          const originalRelative = originalData?.relatives?.find(
            r => r.relativeID === relative.relativeID
          );
          
          console.log('Original relative found:', originalRelative);
          
          if (originalRelative) {
            // So sánh xem có thay đổi không
            const hasChanged = 
              relative.fullName !== originalRelative.fullName ||
              relative.relationship !== originalRelative.relationship ||
              relative.phoneNumber !== originalRelative.phoneNumber ||
              relative.address !== originalRelative.address ||
              relative.occupation !== originalRelative.occupation;

            console.log('Has changes?', hasChanged);

            if (hasChanged) {

              const result = await updateRelative(relative);
              
              if (!result.success) {
                console.error('❌ Update failed:', result.message);
              }
              
              results.push({ type: 'update', result });
            } else {
              console.log('⏭️ SKIP: No changes');
            }
          } else {
            const result = await createRelative(relative, formData.studentId);
            results.push({ type: 'create', result });
          }
        }
      }

      results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.type}: ${r.result.success ? '✅' : '❌'} ${r.result.message || ''}`);
      });

      // Check kết quả
      const hasError = results.some(r => !r.result.success);
      
      if (hasError) {
        const errorMessages = results
          .filter(r => !r.result.success)
          .map(r => r.result.message)
          .join('\n');
        alert(`Có lỗi xảy ra:\n${errorMessages}`);
      } else {
        if (results.length > 0) {
          alert('Cập nhật thông tin người thân thành công!');
        }
        
        // Refresh lại data từ server
        const accountId = localStorage.getItem('accountId');
        const refreshResult = await getStudentInfo(accountId);
        if (refreshResult.success) {
          const student = refreshResult.data;
          
          // Map lại relatives với format đúng
          const mappedRelatives = (student.relatives || []).map(rel => ({
            relativeID: rel.relativeID || rel.RelativeID || rel.id,
            fullName: rel.fullName || rel.FullName || '',
            relationship: rel.relationship || rel.Relationship || '',
            phoneNumber: rel.phoneNumber || rel.PhoneNumber || '',
            address: rel.address || rel.Address || '',
            occupation: rel.occupation || rel.Occupation || '',
            isNew: false
          }));
          
          setFormData(prev => ({
            ...prev,
            relatives: mappedRelatives
          }));
          setOriginalData(prev => ({
            ...prev,
            relatives: JSON.parse(JSON.stringify(mappedRelatives))
          }));
        }
        
        setIsEditingRelatives(false);
      }
    } catch (error) {
      console.error('Error saving relatives:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin người thân');
    } finally {
      setLoadingOptions(false);
    }
  };

  // Hủy chỉnh sửa người thân
  const handleCancelRelatives = () => {
    if (originalData) {
      setFormData(prev => ({
        ...prev,
        relatives: [...(originalData.relatives || [])]
      }));
    }
    setIsEditingRelatives(false);
  };

  // Xóa người thân
  const removeRelative = async (index) => {
    const relative = formData.relatives[index];
    
    // Nếu là relative mới (chưa lưu vào DB), xóa trực tiếp không cần gọi API
    if (relative.isNew === true || String(relative.id).startsWith('new_')) {
      const newRelatives = formData.relatives.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, relatives: newRelatives }));
      return;
    }
    
    // Nếu là relative đã có trong DB, hiện popup xác nhận
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa người thân "${relative.fullName}"?\n\nHành động này không thể hoàn tác.`
    );
    
    if (!confirmDelete) {
      return; // User chọn Cancel
    }

    try {
      setLoadingOptions(true);
      
      console.log('Deleting relative:', relative);
      
      const relativeId = relative.relativeID || relative.id;
      const result = await deleteRelative(relativeId);
      
      if (result.success) {
        console.log('✅ Delete success');
        alert('Xóa người thân thành công!');
        
        // Xóa khỏi formData
        const newRelatives = formData.relatives.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, relatives: newRelatives }));
        
        // Cập nhật originalData
        setOriginalData(prev => ({
          ...prev,
          relatives: newRelatives
        }));
        
        // Refresh lại data từ server để đảm bảo đồng bộ
        const accountId = localStorage.getItem('accountId');
        const refreshResult = await getStudentInfo(accountId);
        if (refreshResult.success) {
          const student = refreshResult.data;
          const mappedRelatives = (student.relatives || []).map(rel => ({
            relativeID: rel.relativeID || rel.RelativeID || rel.id,
            fullName: rel.fullName || rel.FullName || '',
            relationship: rel.relationship || rel.Relationship || '',
            phoneNumber: rel.phoneNumber || rel.PhoneNumber || '',
            address: rel.address || rel.Address || '',
            occupation: rel.occupation || rel.Occupation || '',
            isNew: false
          }));
          
          setFormData(prev => ({
            ...prev,
            relatives: mappedRelatives
          }));
          setOriginalData(prev => ({
            ...prev,
            relatives: JSON.parse(JSON.stringify(mappedRelatives))
          }));
        }
      } else {
        console.error('❌ Delete failed:', result.message);
        alert(`Lỗi khi xóa người thân: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting relative:', error);
      alert('Đã xảy ra lỗi khi xóa người thân');
    } finally {
      setLoadingOptions(false);
    }
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
        onRemove={removeRelative}  // Bỏ comment
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