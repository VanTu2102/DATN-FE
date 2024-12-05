import { createMessage, updateMessage } from "@/controllers/conversation";
import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<any>([]);
    const transcriptionId = useRef<any>();
    const socket = useRef<WebSocket | null>(null);
    let last_turn: any
    let last_id: any
    const updateConversations = async (message: any) => {
        setMessages((prev: any) => {
            let updatedConversations = [...prev];
            let lastMessage = updatedConversations[updatedConversations.length - 1];
            lastMessage.transcript += message.transcript;
            lastMessage.end_time = message.end_time;
            updateMessage(
                last_id,
                lastMessage.speaker,
                lastMessage.transcriptionId,
                lastMessage.start_time,
                lastMessage.end_time,
                lastMessage.transcript
            );
            return updatedConversations;
        });
    };


    useEffect(() => {
        socket.current = new WebSocket(url);
        socket.current.onopen = () => {
            console.log("WebSocket connection opened");
        };
        socket.current.onmessage = async (event) => {
            let message = JSON.parse(event.data)
            if (message.speaker === last_turn) {
                await updateConversations(message)
            }
            else {
                createMessage(message.speaker, transcriptionId.current, message.start_time, message.end_time, message.transcript, message.correct_transcript)
                    .then((m: any) => {
                        last_turn = m.speaker
                        last_id = m.id
                        setMessages((prev: any) => [...prev, m]);
                    })
            }
        };

        socket.current.onclose = () => {
            last_turn = undefined
            last_id = undefined
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
