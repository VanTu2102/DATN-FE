"use client";
import { updateMessage, updateRecord } from "@/controllers/conversation";
import { EditOutlined } from '@ant-design/icons';
import environment from "@/util/environment";
import { Button, Input } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"
import { formatDuration } from "@/functions/time/time_convert";

interface IProps {
    data: any,
    setData?: any
}

const TranscriptionBox: FC<IProps> = ({ data, setData }: IProps) => {
    const [lst_speaker_map, setLstSpeakerMap] = useState<any>({})
    const [mess, setMess] = useState<any>(null)
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const colors = [
        "#B3E6E6", "#B3CCFF", "#E5CCFF", "#F0F0F0", "#FFB3B3", "#B3FFB3", "#B3D9FF", "#FFE0B3", "#DAB3FF",
        "#B3FFFF", "#FFCCCC", "#CCE5FF", "#FFDAB3",
        "#CCFFCC", "#FFCCCC", "#FFFFB3", "#E6CCFF",
        "#D9FFB3", "#FFD9B3", "#D6E6F2"
    ]
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setMess({ ...mess, [name]: value })
    };
    const save = (e: any) => {
        setData(data.map((item: any, index: number) => {
            if (item.id === mess.id) {
                let new_data = {
                    ...item,
                    transcript: item.transcript,
                    correct_transcript: mess.correct_transcript ? mess.correct_transcript : mess.transcript
                }
                updateMessage(new_data.id, new_data.speaker, new_data.transcriptionId, new_data.start_time, new_data.end_time, new_data.transcript, new_data.correct_transcript).then((res: any) => {
                    setMess(null)
                })
                return new_data
            }
            else { return item }
        }))
    };

    useEffect(() => {
        if (replay === "True") {
            if (data && data.length > 0) {
                fetch(`${environment.BE_URL}/transcription/speaker_lst?id=${data[0]['transcriptionId']}`).then(async (response: any) => {
                    const lst_speaker = await response.json();
                    let lst: any = {}
                    lst_speaker.forEach((e: any, i: any) => {
                        lst[e.speaker] = colors[i % colors.length]
                    })
                    setLstSpeakerMap(lst)
                })
                    .catch(() => {
                        data.forEach((item: any) => {
                            if (!Object.keys(lst_speaker_map).includes(item.speaker)) {
                                setLstSpeakerMap((prev: any) => {
                                    let new_data = { ...prev }
                                    new_data[item.speaker] = colors[Object.keys(prev).length % colors.length]
                                    return new_data
                                })
                            }
                        })
                    })
            }
        }
        else {
            data.forEach((item: any) => {
                if (!Object.keys(lst_speaker_map).includes(item.speaker)) {
                    setLstSpeakerMap((prev: any) => {
                        let new_data = { ...prev }
                        new_data[item.speaker] = colors[Object.keys(prev).length % colors.length]
                        return new_data
                    })
                }
            })
        }
    }, [data])
    return (
        <div className="w-full h-[61dvh] relative">
            <div className="overflow-y-scroll bg-white h-full pt-4">
                <div className="divide-y divide-gray-300/50 border-t border-gray-300/50">
                    <div className="space-y-6 py-4 text-[14px] leading-7 text-gray-600 h-[400px] overflow-y-auto">
                        <ul className="space-y-4 px-2">
                            {data?.map((item: any, index: number) => {
                                return <li
                                    key={index}
                                    className={`flex flex-col justify-center items-start ${item.role === "user" ? "ml-10 justify-end" : "mr-10"
                                        }`}
                                >
                                    <span className="">{item.speaker}</span>
                                    <div className="p-4 pt-2 pb-6 rounded-md relative flex items-center min-w-[10%] max-w-[80%]" style={{ backgroundColor: lst_speaker_map[item.speaker] }}>{item.correct_transcript ? item.correct_transcript : item.transcript}
                                        <span className="text-[10px] absolute bottom-0 right-[10px]">{formatDuration(Math.round(item.start_time))} - {formatDuration(Math.round(item.end_time))}</span>
                                        {item.id ? <div onClick={() => { setMess(item) }}
                                            className="absolute right-[-40px] top-4 rounded-full border hover:cursor-pointer w-8 h-8 flex justify-center items-center">
                                            <EditOutlined></EditOutlined>
                                        </div> : <></>}
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {mess ? <div className="absolute w-full bottom-0 divide-y divide-gray-300/50 border-t border-gray-300/50">
                <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                    <Input className="py-2"
                        name={mess.correct_transcript ? 'correct_transcript' : 'transcript'}
                        value={mess.correct_transcript ? mess.correct_transcript : mess.transcript}
                        onChange={handleChange}
                        onPressEnter={save}
                    ></Input>
                </div>
            </div> : <></>}
        </div>
    )
}

export default TranscriptionBox
