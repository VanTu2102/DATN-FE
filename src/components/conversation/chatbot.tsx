"use client";
import { createTranscription, findUniqueRecord, updateRecord } from "@/controllers/conversation";
import { blobToPCM, encodeWAV, resamplePCM } from "@/functions/audio/audio_process";
import { base64ToUint8Array, blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import { Button, Input } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"
import TranscriptionBox from "./transcription_box";
import environment from "@/util/environment";
import useWebSocketChat from "@/hooks/useWebSocketChat";

interface IProps {
    data: any,
    setData: any
}

type Message = {
    sender: "user" | "bot";
    text: string;
};


const ChatBot: FC<IProps> = ({ data, setData }: IProps) => {
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const id = searchParams.get('id')
    const router = useRouter()
    const { messages, setMessages, sendMessage, close } = useWebSocketChat(`${environment.WS_URL}/ws_chat?transcription_id=${data.transcription.id}`);
    const [input, setInput] = useState<string>("");
    useEffect(() => {

        console.log(messages)
    }, [messages])
    return <div className="w-[45vw] mx-auto bg-white" style={{ height: "calc(100vh - 65px)" }}>
        <div className="h-full overflow-y-auto border border-gray-300 rounded p-2" style={{ height: "calc(100% - 40px)" }}>
            {messages.map((msg: any, index: any) => (
                <li
                    key={index}
                    className={`flex flex-col min-w-[10%] max-w-[90%] justify-center mb-4 items-start ${msg.sender === "user" ? "ml-10 items-end" : "mr-10"
                        }`}
                >
                    <span className="bg-[#358cf7] flex flex-col px-4 py-2 rounded-md text-white font-semibold text-[14px]">
                        {/* <span className="">{msg.sender}</span> */}
                        {msg.message}
                    </span>
                </li>
            ))}
        </div>
        <div className="flex">
            <Input
                onPressEnter={() => {
                    setMessages((prev: any) => [...prev, {
                        "message": input,
                        "sender": "user"
                    }])
                    sendMessage(input)
                    setInput("")
                }}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow border border-gray-300 rounded px-2 py-1 h-[40px]"
            />
        </div>
    </div>
}

export default ChatBot
