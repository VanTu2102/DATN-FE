"use client";
import { createTranscription, findUniqueRecord, updateRecord } from "@/controllers/conversation";
import { blobToPCM, encodeWAV, resamplePCM } from "@/functions/audio/audio_process";
import { base64ToUint8Array, blobToUint8Array, uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
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
    const id = searchParams.get('id')
    const router = useRouter()
    const [audioDom, setAudioDom] = useState<any>(<audio controls className="w-full bg-white p-1 rounded-full"></audio>)
    const timeCounter = useRef<number>(0)
    const [time, setTime] = useState<number>(0)
    const [state_record, setState] = useState<any>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const { messages, transcriptionId, sendMessage, close } = useWebSocket(`${environment.WS_URL}/ws`);
    useEffect(() => {
        if (messages) {
            if (messages.length > 0) {
                let new_data = { ...data }
                new_data.transcription = correct_transcription({
                    data: messages
                })
                setData(new_data)
            }
            else {
                if (replay === "False") {
                    createTranscription(parseInt(id!)).then((v: any) => {
                        transcriptionId.current = v
                    })
                }
            }
        }
    }, [messages])

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

            mediaRecorderRef.current.ondataavailable = async (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data);

                    const arrayBuffer = await event.data.arrayBuffer();
                    if (!headerChunk) {
                        headerChunk = arrayBuffer
                        blobToPCM(new Blob([arrayBuffer], { type: 'audio/webm' })).then(async (v) => {
                            const resampledPCM = await resamplePCM(v.pcmData[0], v.sampleRate, 16000, 1);
                            if (sendMessage) {
                                sendMessage(resampledPCM.buffer)
                            }
                        })
                    } else {
                        const combinedBuffer = new Uint8Array(headerChunk.byteLength + arrayBuffer.byteLength);
                        combinedBuffer.set(new Uint8Array(headerChunk), 0);
                        combinedBuffer.set(new Uint8Array(arrayBuffer), headerChunk.byteLength);
                        blobToPCM(new Blob([combinedBuffer.buffer], { type: 'audio/webm' })).then(async (v) => {
                            let resampledPCM = await resamplePCM(v.pcmData[0], v.sampleRate, 16000, 1);
                            resampledPCM = resampledPCM.slice(resampledPCM.length * headerChunk.byteLength / (headerChunk.byteLength + arrayBuffer.byteLength))
                            if (sendMessage) {
                                sendMessage(resampledPCM.buffer)
                            }
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
                            findUniqueRecord(data.id).then((v: any) => {
                                setData(v)
                                setState(mediaRecorderRef.current?.state)
                                router.push(`/conversation?id=${data.id}&replay=True`)
                            })
                        })
                    })
                });
            };

            mediaRecorderRef.current.start(1000);
            setState(mediaRecorderRef.current?.state)
        } catch (error) {
            console.error("Không thể ghi âm:", error);
        }
    };
    const stopRecording = () => {
        // close()
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };
    const pauseRecording = () => {
        mediaRecorderRef.current?.pause()
        setState("paused")
    }

    const resumeRecording = () => {
        mediaRecorderRef.current?.resume()
        setState("recording")
    }

    const correct_transcription = (messages: any) => {
        // messages.data.forEach(async (message: any) => {
        //     const res = await fetch(`${environment.BE_URL}/llm/correct_transcription`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             original_sentence: message.transcript
        //         }),
        //     })
        //         .catch((e: any) => {
        //             return e
        //         })
        //     const correct = await res.json();
        //     console.log(correct)
        // });
        return messages
    }

    useEffect(() => {
        if (replay === "False") {
            if (data && !data.data) {
                if (!mediaRecorderRef.current?.state) {
                    startRecording()
                }
            }
        }
        else {
            if (data && data.data) {
                const url = URL.createObjectURL(new Blob([Buffer.from(base64ToUint8Array(data && data.data ? data!.data : ''))], { type: 'audio/wav' }))
                setAudioDom(
                    <audio controls className="w-full bg-white p-1 rounded-full">
                        <source src={url} type="audio/wav"></source>
                    </audio>
                )
            }
        }
    }, [data])
    useEffect(() => {
        if (replay === "False" && state_record === 'recording') {
            setTimeout(() => {
                setTime(time + 1)
                timeCounter.current = time
                setTimeCounter(time)
            }, 1000);
        }
    }, [time, state_record])
    if (replay === "False") {
        return (
            <div className="w-full h-full">
                <div className="flex fixed bottom-4">
                    {state_record === "recording" ? <Button type="primary" className="my-2 text-[14px] mr-2 font-semibold" onClick={pauseRecording}>Tạm dừng</Button> : <></>}
                    {state_record === "paused" ? <Button type="primary" className="my-2 text-[14px] mr-2 font-semibold" onClick={resumeRecording}>Tiếp tục</Button> : <></>}
                    <Button type="primary" className="my-2 text-[14px] font-semibold" onClick={stopRecording}>Dừng ghi</Button>
                </div>
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
        return (
            <div className="w-full h-full">
                {audioDom}
                {data ?
                    (
                        !data?.transcription ?
                            <>
                                <Button type="primary" className="my-2 text-[14px] font-semibold" onClick={async () => {
                                    const response = await fetch(`${environment.BE_URL}/transcription/file?id=${data.id}`)
                                    const json = await response.json();
                                    let new_data = { ...data }
                                    new_data.transcription = correct_transcription(json)
                                    setData(new_data)
                                }}>Phiên âm</Button>
                            </>
                            :
                            <>
                                <TranscriptionBox data={data.transcription.data} setData={(v: any) => {
                                    setData({
                                        ...data,
                                        transcription: {
                                            data: v
                                        }
                                    })
                                }}></TranscriptionBox>
                            </>
                    )
                    :
                    <>
                        <TranscriptionBox data={data?.transcription?.data} setData={(v: any) => {
                            setData({
                                ...data,
                                transcription: {
                                    data: v
                                }
                            })
                        }}></TranscriptionBox>
                    </>
                }
            </div>
        )
    }
}

export default ConversationTab
