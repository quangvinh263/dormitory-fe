import { ROLES } from './constants';

export const ROLE_MENUS = {
  [ROLES.ADMIN]: [
    { path: '/admin', label: 'Tổng quan' },
    { path: '/admin/managers', label: 'Trưởng tòa' },
    { path: '/admin/buildings', label: 'Tòa nhà/phòng' },
    { path: '/admin/reports', label: 'Báo cáo' },
    { path: '/admin/settings', label: 'Cấu hình' },
  ],
  [ROLES.MANAGER]: [
    { path: '/manager', label: 'Tổng quan' },
    { path: '/manager/rooms', label: 'Phòng' },
    { path: '/manager/maintenance', label: 'Bảo trì' },
    { path: '/manager/utilities', label: 'Điện nước' },
    { path: '/manager/bills', label: 'Thanh toán' },
    { path: '/manager/violations', label: 'Vi phạm' },
    { path: '/manager/contracts', label: 'Hợp đồng' },
  ],
  [ROLES.STUDENT]: [
    { path: '/student', label: 'Tổng quan' },
    { path: '/student/contract', label: 'Hợp đồng' },
    { path: '/student/extension', label: 'Gia hạn' },
    { path: '/student/maintenance', label: 'Bảo trì' },
    { path: '/student/utility', label: 'Điện nước' },
    { path: '/student/insurance', label: 'Bảo hiểm' },
    { path: '/student/violations', label: 'Vi phạm' },
  ]
};