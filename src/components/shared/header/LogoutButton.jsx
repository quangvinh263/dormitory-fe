import { useNavigate } from 'react-router-dom';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '../../../services/authApi';

import Button from '../../ui/Button'; 

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refToken = localStorage.getItem('refreshToken'); 
    const response = await signOut(refToken);
    if(response.success) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accountId');
      localStorage.removeItem('role');
      localStorage.removeItem('buildingID');
      localStorage.removeItem('buildingName');
      navigate('/auth/login');
    }
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