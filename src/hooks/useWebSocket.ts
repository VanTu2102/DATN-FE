import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const socket = useRef<WebSocket | null>(null);
    let last_turn: any

    useEffect(() => {
        socket.current = new WebSocket(url);
        socket.current.onopen = () => {
            console.log("WebSocket connection opened");
        };
        socket.current.onmessage = (event) => {
            let message = JSON.parse(event.data)
            if (message.speaker === last_turn) {
                setMessages((prev: any) => {
                    let conversations = [...prev]
                    conversations[conversations.length - 1].transcript += ` ${message.transcript}`
                    conversations[conversations.length - 1].end_time = message.end_time
                    return conversations
                });
            }
            else {
                last_turn = message.speaker
                setMessages((prev: any) => [...prev, message]);
            }
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

    const close = () => {
        socket.current?.close()
    }

    return { messages, sendMessage, close };
};

export default useWebSocket;
