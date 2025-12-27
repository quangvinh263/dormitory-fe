import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

import StatCard from '../../shared/StatCard';

const FinanceReport = () => {
    // --- 1. MOCK DATA (Dữ liệu giả lập để làm UI) ---
    const summaryData = {
        totalRevenue: 650000000,
        growth: 8, // +8%
        paidAmount: 598500000,
        paidPercentage: 92,
        unpaidAmount: 51500000,
        unpaidCount: 78
    };

    // Dữ liệu biểu đồ (6 tháng) - Adjusted for Line Chart visualization
    const chartData = [
        { name: 'T1', tienPhong: 280000000, dienNuoc: 90000000, baoHiem: 25000000 },
        { name: 'T2', tienPhong: 285000000, dienNuoc: 85000000, baoHiem: 28000000 },
        { name: 'T3', tienPhong: 290000000, dienNuoc: 95000000, baoHiem: 26000000 },
        { name: 'T4', tienPhong: 288000000, dienNuoc: 92000000, baoHiem: 29000000 },
        { name: 'T5', tienPhong: 295000000, dienNuoc: 98000000, baoHiem: 30000000 },
        { name: 'T6', tienPhong: 300000000, dienNuoc: 100000000, baoHiem: 32000000 },
    ];

    // Helper: Format tiền tệ VNĐ
    const formatCurrency = (val) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    // Helper: Format trục Y (Rút gọn số lớn: 100tr -> 100M)
    const formatYAxis = (tickItem) => {
        if (tickItem >= 1000000000) return tickItem / 1000000000 + 'B';
        if (tickItem >= 1000000) return tickItem / 1000000 + 'M';
        return tickItem;
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-10">
            
            {/* --- PHẦN 1: BIỂU ĐỒ DOANH THU (LINE CHART) --- */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg">Doanh Thu Theo Tháng</h3>
                        <p className="text-gray-500 text-sm mt-1">Thống kê chi tiết các nguồn thu (Tiền phòng, Điện nước, Bảo hiểm)</p>
                    </div>
                    
                    {/* (Optional) Filter chọn năm */}
                    <select className="text-sm border-gray-300 border rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 bg-gray-50">
                        <option>Năm 2024</option>
                        <option>Năm 2023</option>
                    </select>
                </div>

                {/* Container chứa biểu đồ */}
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#6B7280', fontSize: 13, fontWeight: 500}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#6B7280', fontSize: 12}}
                                tickFormatter={formatYAxis} 
                            />
                            <Tooltip 
                                cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }} // Dotted line cursor
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend 
                                iconType="circle" 
                                wrapperStyle={{ paddingTop: '20px' }}
                                formatter={(value) => (
                                    <span className="ml-2 mr-8 text-sm font-medium text-gray-600">{value}</span>
                                )}
                            />
                            
                            {/* Đường biểu đồ (Lines) */}
                            {/* Tiền phòng: Blue-500 */}
                            <Line 
                                type="monotone" 
                                dataKey="tienPhong" 
                                name="Tiền phòng" 
                                stroke="#3B82F6" 
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} // Custom dot style
                                activeDot={{ r: 6 }}
                            />
                            
                            {/* Tiền điện nước: Green-500 */}
                            <Line 
                                type="monotone" 
                                dataKey="dienNuoc" 
                                name="Tiền điện nước" 
                                stroke="#10B981" 
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6 }}
                            />

                            {/* Bảo hiểm: Amber-500 */}
                            <Line 
                                type="monotone" 
                                dataKey="baoHiem" 
                                name="Bảo hiểm" 
                                stroke="#F59E0B" 
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- PHẦN 2: THẺ TÓM TẮT (CARDS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Tổng doanh thu -> Dùng type="success" (Xanh lá) */}
                <StatCard 
                    title="Tổng doanh thu T8" 
                    value={formatCurrency(summaryData.totalRevenue)}
                    subtext={`+${summaryData.growth}% so với tháng trước`}
                    icon={<CurrencyDollarIcon className="w-6 h-6" />}
                    type="success" 
                />

                {/* 2. Đã thanh toán -> Dùng type="info" (Xanh dương) */}
                <StatCard 
                    title="Đã thanh toán" 
                    value={formatCurrency(summaryData.paidAmount)}
                    subtext={`Đạt ${summaryData.paidPercentage}% tổng số phải thu`}
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    type="info" 
                />

                {/* 3. Chưa thanh toán -> Dùng type="warning" (Cam) */}
                <StatCard 
                    title="Chưa thanh toán" 
                    value={formatCurrency(summaryData.unpaidAmount)} 
                    subtext={`${summaryData.unpaidCount} sinh viên chưa đóng`}
                    icon={<ExclamationCircleIcon className="w-6 h-6" />}
                    type="warning" 
                />
            </div>
        </div>
    );
};

export default FinanceReport;