"use client";
import { updateRecord } from "@/controllers/conversation";
import { blobToPCM, encodeWAV, resamplePCM } from "@/functions/audio/audio_process";
import { blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import { Button } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"
import TranscriptionBox from "./transcription_box";
import environment from "@/util/environment";
import useWebSocket from "@/hooks/useWebSocket";

interface IProps {
    data: any,
    setData: any,
    setTimeCounter: any
}

const ConversationTab: FC<IProps> = ({ data, setTimeCounter, setData }: IProps) => {
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const [audioDom, setAudioDom] = useState<any>(<audio controls className="w-full bg-white p-1 rounded-full"></audio>)
    if (replay === "False") {
        const timeCounter = useRef<number>(0)
        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
        const audioChunksRef = useRef<Blob[]>([]);
        const { messages, sendMessage } = useWebSocket(`${environment.WS_URL}/ws`);

        const startRecording = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error("Trình duyệt không hỗ trợ ghi âm");
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];
                let headerChunk: any = null;
                let firstChunk: any = null

                mediaRecorderRef.current.ondataavailable = async (event) => {
                    if (event.data && event.data.size > 0) {
                        timeCounter.current = Math.round(event.timecode) / 1000
                        setTimeCounter(timeCounter.current)
                        audioChunksRef.current.push(event.data);

                        const arrayBuffer = await event.data.arrayBuffer();
                        if (!headerChunk) {
                            headerChunk = arrayBuffer
                            blobToPCM(new Blob([arrayBuffer], { type: 'audio/webm' })).then(async (v) => {
                                firstChunk = v.pcmData[0]
                                const resampledPCM = await resamplePCM(v.pcmData[0], v.sampleRate, 16000, 1);
                                sendMessage(resampledPCM.buffer)
                            })
                        } else {
                            const combinedBuffer = new Uint8Array(headerChunk.byteLength + arrayBuffer.byteLength);
                            combinedBuffer.set(new Uint8Array(headerChunk), 0);
                            combinedBuffer.set(new Uint8Array(arrayBuffer), headerChunk.byteLength);
                            blobToPCM(new Blob([combinedBuffer.buffer], { type: 'audio/webm' })).then(async (v) => {
                                const resampledPCM = await resamplePCM(v.pcmData[0], v.sampleRate, 16000, 1);
                                sendMessage(resampledPCM.slice(firstChunk / 3).buffer)
                            })
                        }
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    stream.getTracks().forEach((track) => {
                        track.stop()
                    });
                    mediaRecorderRef.current = null
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    blobToPCM(audioBlob).then(({ pcmData, sampleRate, numberOfChannels }) => {
                        const wavBlob = encodeWAV(pcmData, sampleRate, numberOfChannels);
                        blobToUint8Array(wavBlob).then((unit8arr_data: any) => {
                            updateRecord(data.id, data.name, uint8ArrayToBase64(unit8arr_data), timeCounter.current).then((v: any) => {
                                window.location.href = `/conversation?id=${data.id}&replay=True`
                            })
                        })
                    });
                };

                mediaRecorderRef.current.start(2000);
            } catch (error) {
                console.error("Không thể ghi âm:", error);
            }
        };
        const stopRecording = () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
        };

        useEffect(() => {
            if (replay === "False" && data) {
                startRecording()
            }
        }, [data])

        useEffect(() => {
            console.log(messages)
        }, [messages])
        return (
            <div className="w-full h-max">
                <Button type="primary" className="my-2 text-[14px] font-semibold fixed bottom-4" onClick={stopRecording}>Dừng ghi</Button>
                {data && data?.transcription ?
                    (
                        <>
                            <TranscriptionBox data={data.transcription?.data}></TranscriptionBox>
                        </>
                    )
                    :
                    <></>
                }
            </div>
        )
    }
    else {

        useEffect(() => {
            if (data && data.data) {
                const url = URL.createObjectURL(new Blob([Buffer.from(data && data.data ? data!.data!.data : [])], { type: 'audio/wav' }))
                setAudioDom(
                    <audio controls className="w-full bg-white p-1 rounded-full">
                        <source src={url} type="audio/wav"></source>
                    </audio>
                )
            }
        }, [data])
        return (
            <div className="w-full h-max">
                {audioDom}
                {data ?
                    (
                        !data?.transcription ?
                            <>
                                <Button type="primary" className="my-2 text-[14px] font-semibold" onClick={async () => {
                                    const response = await fetch(`${environment.BE_URL}/transcription/file?id=${data.id}`)
                                    const json = await response.json();
                                    let new_data = { ...data }
                                    new_data.transcription = json
                                    setData(new_data)
                                }}>Phiên âm</Button>
                            </>
                            :
                            <>
                                <TranscriptionBox data={data.transcription.data}></TranscriptionBox>
                            </>
                    )
                    :
                    <>
                        <TranscriptionBox data={data?.transcription?.data}></TranscriptionBox>
                    </>
                }
            </div>
        )
    }
}

export default ConversationTab
