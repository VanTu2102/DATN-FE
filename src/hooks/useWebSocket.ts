import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        socket.current = new WebSocket(url);
        socket.current.onopen = () => {
            console.log("WebSocket connection opened");
        };
        socket.current.onmessage = (event) => {
            setMessages((prev: any) => [...prev, event.data]);
        };

        socket.current.onclose = () => {
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
    };

    const close = ()=>{
        socket.current?.close()
    }

    return { messages, sendMessage, close };
};

export default useWebSocket;
