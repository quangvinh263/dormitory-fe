import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { getValidAccessToken } from '../services/axiosInstance';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HUB_URL = API_BASE_URL.replace('/api', '') + "/notificationHub"; 

const useNotificationSignalR = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Cấu hình kết nối
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: async () => {
                    const token = await getValidAccessToken();
                    return token || ""; 
                }
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    if (retryContext.elapsedMilliseconds < 60000) {
                        return Math.random() * 10000;
                    } else {
                        return null;
                    }
                }
            })
            .configureLogging(signalR.LogLevel.Warning) 
            .build();


        const startConnection = async () => {
            try {
                await connection.start();
                console.log("✅ SignalR Connected!");

                connection.on("ReceiveNotification", (data) => {
                    console.log("🔔 SignalR Noti:", data);
                    setNotifications(prev => [data, ...prev]);
                });

            } catch (err) {
                console.error("❌ SignalR Connection Error: ", err);
            }
        };

        startConnection();

        return () => {
            connection.stop();
        };
    }, []);

    return { notifications };
};

export default useNotificationSignalR;