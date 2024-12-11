"use client";
import { createTranscription, findUniqueRecord, updateRecord } from "@/controllers/conversation";
import { blobToPCM, encodeWAV, resamplePCM } from "@/functions/audio/audio_process";
import { base64ToUint8Array, blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import { Button } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"
import TranscriptionBox from "./transcription_box";
import environment from "@/util/environment";
import useWebSocketChat from "@/hooks/useWebSocketChat";

interface IProps {
    data: any,
    setData: any
}

const ChatBot: FC<IProps> = ({ data, setData }: IProps) => {
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const id = searchParams.get('id')
    const router = useRouter()
    const { messages, sendMessage, close } = useWebSocketChat(`${environment.WS_URL}/ws_chat?transcription_id=${data.transcription.id}`);
    useEffect(() => {
        
        console.log(messages)
    }, [messages])
    return <Button onClick={()=>{sendMessage("bộ phim không thời gian được xây dựng trên cơ sở nào?")}}>Click test</Button>
}

export default ChatBot
