// hooks/useNotificationSignalR.js
import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Cắt bỏ /api nếu có để lấy root domain
const HUB_URL = API_BASE_URL.replace('/api', '') + "/notificationHub"; 

const useNotificationSignalR = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // 1. Lấy JWT TOKEN (Cái chìa khóa) - KHÔNG PHẢI accountId
        // Hãy kiểm tra F12 -> Application -> Local Storage xem bạn lưu token tên key là gì?
        // Thường là 'token' hoặc 'accessToken'
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken'); 
        
        if (!token) {
            console.error("❌ Không tìm thấy Token đăng nhập!");
            return;
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                // Gửi Token để Backend biết "tôi là ai"
                accessTokenFactory: () => token 
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("✅ SignalR Connected!"))
            .catch(err => console.error("❌ SignalR Connection Error: ", err));

        connection.on("ReceiveNotification", (data) => {
            console.log("🔔 Có thông báo mới:", data);
            setNotifications(prev => [data, ...prev]);
        });

        return () => { connection.stop(); };
    }, []);

    return { notifications };
};

export default useNotificationSignalR;