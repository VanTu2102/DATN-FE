import { Button } from "antd"
import { useSearchParams } from "next/navigation"
import { FC, useState } from "react"

interface IProps {
    data: any,
}

const ConversationTab: FC<IProps> = ({ data }: IProps) => {
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const [dataAudioSource, setDataAudioSource] = useState<any>(Buffer.from(data && data.data ? data!.data!.data : []))
    console.log(data, dataAudioSource)
    return (
        <div className="w-full h-max">
            <audio controls className="w-full bg-white p-1 rounded-full">
                <source src="horse.ogg" type="audio/ogg"></source>
            </audio>
            {!data?.transcription && replay==="True"? <>
                <Button type="primary" className="my-2 text-[14px] font-semibold">Phiên âm</Button>
            </> : <></>}
        </div>
    )
}

export default ConversationTab
