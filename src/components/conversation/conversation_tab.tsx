"use client";
import { updateRecord } from "@/controllers/conversation";
import { getAudioDurationFromBuffer } from "@/functions/audio/audio_process";
import { blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import { Button } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"

interface IProps {
    data: any,
    setTimeCounter: any
}

const ConversationTab: FC<IProps> = ({ data, setTimeCounter }: IProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const replay = searchParams.get('replay')
    const [audioDom, setAudioDom] = useState<any>(<audio controls className="w-full bg-white p-1 rounded-full"></audio>)
    const [time, setTime] = useState<number>(0)
    const timeCounter = useRef<number>(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("Trình duyệt không hỗ trợ ghi âm");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async (ev: any) => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                stream.getTracks().forEach((track) => {
                    track.stop()
                });
                blobToUint8Array(audioBlob).then((unit8arr_data: any) => {
                    updateRecord(data.id, data.name, uint8ArrayToBase64(unit8arr_data), timeCounter.current).then((v: any) => {
                        router.push(`/home?next=/conversation?id=${data.id},replay=True`)
                    })
                })
            };

            mediaRecorderRef.current.start();
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
        if (data && data.data) {
            const url = URL.createObjectURL(new Blob([Buffer.from(data && data.data ? data!.data!.data : [])], { type: 'audio/wav' }))
            setAudioDom(
                <audio controls className="w-full bg-white p-1 rounded-full">
                    <source src={url} type="audio/wav"></source>
                </audio>
            )
        }
        if (replay === "False" && !data?.data) {
            startRecording()
        }
    }, [data])
    useEffect(() => {
        if (replay === "False") {
            setTimeout(() => {
                setTime(Math.round((time + 0.1) * 1000) / 1000)
                setTimeCounter(time)
                timeCounter.current = time
            }, 100);
        }
    }, [time])
    return (
        <div className="w-full h-max">
            {replay === "True" ? audioDom : <>
                <Button type="primary" className="my-2 text-[14px] font-semibold fixed bottom-4" onClick={stopRecording}>Dừng ghi</Button>
            </>}
            {!data?.transcription && replay === "True" ? <>
                <Button type="primary" className="my-2 text-[14px] font-semibold">Phiên âm</Button>
            </> : <></>}
        </div>
    )
}

export default ConversationTab
