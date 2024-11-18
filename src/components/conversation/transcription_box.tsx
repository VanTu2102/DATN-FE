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
        <div className="w-full h-[60dvh] overflow-y-scroll">
            <div className="relative bg-white h-max">
                <div className="divide-y divide-gray-300/50 border-t border-gray-300/50">
                    <div className="space-y-6 py-8 text-[14px] leading-7 text-gray-600 h-[400px] overflow-y-auto">
                        <ul className="space-y-4 px-4">
                            {data.map((item: any) => (
                                <li
                                    key={item.id}
                                    className={`flex flex-col justify-center items-start ${item.role === "user" ? "ml-10 justify-end" : "mr-10"
                                        }`}
                                >
                                    <span className="">{item.speaker}</span>
                                    <p className="bg-gray-100 p-4 pt-2 pb-6 rounded-md relative">{item.transcript}
                                        <span className="text-[10px] absolute bottom-0 right-[10px]">{Math.round(item.start_time)}s - {Math.round(item.end_time)}s</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TranscriptionBox
