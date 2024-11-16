"use client";
import { updateRecord } from "@/controllers/conversation";
import { blobToPCM, encodeWAV, getAudioDurationFromBuffer } from "@/functions/audio/audio_process";
import { blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import { Button } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"

interface IProps {
    data: any,
    setData?: any
}

const TranscriptionBox: FC<IProps> = ({ data, setData }: IProps) => {
    console.log(data)
    return (
        <div className="w-full h-max">
        </div>
    )
}

export default TranscriptionBox
