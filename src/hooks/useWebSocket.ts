import { createMessage, updateMessage } from "@/controllers/conversation";
import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<any>([]);
    const transcriptionId = useRef<any>();
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
                setMessages(async (prev: any) => {
                    let conversations = [...prev]
                    conversations[conversations.length - 1]!.transcript += ` ${message.transcript}`
                    conversations[conversations.length - 1]!.end_time = message.end_time
                    let last_message = conversations[conversations.length - 1]
                    last_message = await updateMessage(last_message.id, last_message.speaker, last_message.transcriptionId, last_message.start_time, last_message.end_time, last_message.transcript)
                    return conversations
                })
            }
            else {
                createMessage(message.speaker, transcriptionId.current, message.start_time, message.end_time, message.transcript, message.correct_transcript)
                    .then((m: any) => {
                        last_turn = m.speaker
                        setMessages((prev: any) => [...prev, m]);
                    })
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

    return { messages, transcriptionId, sendMessage, close };
};

export default useWebSocket;
