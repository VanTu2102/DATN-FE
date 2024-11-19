"use client";
import { updateRecord } from "@/controllers/conversation";
import { blobToPCM, encodeWAV, getAudioDurationFromBuffer } from "@/functions/audio/audio_process";
import { blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import environment from "@/util/environment";
import { Button } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"

interface IProps {
    data: any,
    setData?: any
}

const TranscriptionBox: FC<IProps> = ({ data, setData }: IProps) => {
    const [lst_speaker_map, setLstSpeakerMap] = useState<any>({})
    const colors = [
        "#B3E6E6", "#B3CCFF", "#E5CCFF", "#F0F0F0", "#FFB3B3", "#B3FFB3", "#B3D9FF", "#FFE0B3", "#DAB3FF",
        "#B3FFFF", "#FFCCCC", "#CCE5FF", "#FFDAB3",
        "#CCFFCC", "#FFCCCC", "#FFFFB3", "#E6CCFF",
        "#D9FFB3", "#FFD9B3", "#D6E6F2"
    ]

    useEffect(() => {
        if (data && data.length > 0) {
            fetch(`${environment.BE_URL}/transcription/speaker_lst?id=${data[0]['transcriptionId']}`).then(async (response: any) => {
                const lst_speaker = await response.json();
                let lst: any = {}
                lst_speaker.forEach((e: any, i: any) => {
                    lst[e.speaker] = colors[i % colors.length]
                })
                setLstSpeakerMap(lst)
            })
        }
    }, [data])
    return (
        <div className="w-full h-[60dvh] overflow-y-scroll">
            <div className="relative bg-white h-max pt-4">
                <div className="divide-y divide-gray-300/50 border-t border-gray-300/50">
                    <div className="space-y-6 py-4 text-[14px] leading-7 text-gray-600 h-[400px] overflow-y-auto">
                        <ul className="space-y-4 px-2">
                            {data?.map((item: any) => (
                                <li
                                    key={item.id}
                                    className={`flex flex-col justify-center items-start ${item.role === "user" ? "ml-10 justify-end" : "mr-10"
                                        }`}
                                >
                                    <span className="">{item.speaker}</span>
                                    <p className="p-4 pt-2 pb-6 rounded-md relative" style={{ backgroundColor: lst_speaker_map[item.speaker] }}>{item.transcript}
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
