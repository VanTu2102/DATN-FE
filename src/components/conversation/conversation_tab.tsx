"use client";
import { Button } from "antd"
import { useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface IProps {
    data: any,
}

const ConversationTab: FC<IProps> = ({ data }: IProps) => {
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const [audioDom, setAudioDom] = useState<any>()
    useEffect(() => {
        const url = URL.createObjectURL(new Blob([Buffer.from(data && data.data ? data!.data!.data : [])], { type: 'audio/wav' }))
        setAudioDom(
            <audio controls className="w-full bg-white p-1 rounded-full">
                <source src={url} type="audio/wav"></source>
            </audio>
        )
        console.log(data, audioDom, url)
    }, [data])
    return (
        <div className="w-full h-max">
            {replay === "True" ? audioDom : <></>}
            {!data?.transcription && replay === "True" ? <>
                <Button type="primary" className="my-2 text-[14px] font-semibold">Phiên âm</Button>
            </> : <></>}
        </div>
    )
}

export default ConversationTab
