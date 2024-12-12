"use client";
import { Button, Input } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"
import environment from "@/util/environment";
import useWebSocketChat from "@/hooks/useWebSocketChat";
import { AiOutlineCloseCircle } from 'react-icons/ai'

interface IProps {
    data: any,
    setOpenChatbot: any
}


const ChatBot: FC<IProps> = ({ data, setOpenChatbot }: IProps) => {
    const searchParams = useSearchParams()
    const { messages, socketState, setMessages, sendMessage, close } = useWebSocketChat(`${environment.WS_URL}/ws_chat?transcription_id=${data.transcription.id}`);
    const [input, setInput] = useState<string>("");
    useEffect(() => {
        console.log(messages, socketState)
    }, [messages])
    return <div className="w-[45vw] mx-auto bg-white" style={{ height: "calc(100vh - 65px)" }}>
        <div className="h-[40px] border border-gray-300 flex justify-end items-center px-4 text-[20px]">
            <AiOutlineCloseCircle className="cursor-pointer" onClick={() => setOpenChatbot(false)}></AiOutlineCloseCircle>
        </div>
        <div className="h-full overflow-y-auto border border-gray-300 p-2" style={{ height: "calc(100% - 80px)" }}>
            {messages.map((msg: any, index: any) => (
                <li
                    key={index}
                    className={`flex flex-col min-w-[10%] max-w-[90%] justify-center mb-4 items-start ${msg.sender === "user" ? "ml-10 items-end" : "mr-10"}`}
                >
                    <span className={`${msg.sender === "system" && msg.message === "Chưa kết nối với server" ? "bg-[#eb4747]" : "bg-[#358cf7]"} flex flex-col px-4 py-2 rounded-md text-white font-semibold text-[14px]`}>
                        {/* <span className="">{msg.sender}</span> */}
                        {msg.message}
                    </span>
                </li>
            ))}
        </div>
        <div className="flex">
            <Input
                disabled={!socketState}
                placeholder={!socketState ? "Chưa kết nối tới server!" : ""}
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
