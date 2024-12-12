import { useEffect, useRef, useState } from "react";

const useWebSocketChat = (url: string) => {
    const [messages, setMessages] = useState<any>([]);
    const [socketState, setSocketState] = useState<any>();
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        socket.current = new WebSocket(url);
        socket.current.onopen = () => {
            setSocketState(true)
            console.log("WebSocket connection opened");
        };
        socket.current.onmessage = async (event) => {
            setMessages((prev: any) => [...prev, JSON.parse(event.data)])
        };

        socket.current.onclose = () => {
            setSocketState(false)
            console.log("WebSocket connection closed");
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [url]);

    const sendMessage = (message: any) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(message);
        }
        else {
            setMessages((prev: any) => [...prev, {
                "message": "Chưa kết nối với server",
                "sender": "system"
            }])
        }
    };

    const close = () => {
        setSocketState(false)
        socket.current?.close()
    }

    return { messages, socketState, setMessages, sendMessage, close };
};

export default useWebSocketChat;
