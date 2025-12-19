import { useNavigate } from 'react-router-dom';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

import Button from '../../ui/Button'; 

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Sau này sẽ thêm logic xóa Token/User trong Context ở đây
    // 2. Chuyển hướng về trang login
    navigate('/auth/login');
  };

  return (
    <Button 
      variant="white" // Dùng variant 'white' để có viền xám, nền trắng như cũ
      icon={<ArrowRightStartOnRectangleIcon className="w-5 h-5" />}
      onClick={handleLogout}
    >
      Đăng xuất
    </Button>
  );
}