import { useSearchParams } from "next/navigation"
import { FC, useState } from "react"

interface IProps {
    data: any,
}

const ConversationTab: FC<IProps> = ({ data }: IProps) => {
    const searchParams = useSearchParams()
    const state = searchParams.get('state')
    const [dataAudioSource, setDataAudioSource] = useState<any>(Buffer.from(data && data.data ? data!.data!.data : []))
    console.log(data, dataAudioSource, state)
    return (
        <div className="w-full h-max">
            <audio controls className="w-full bg-white p-1 rounded-full">
                <source src="horse.ogg" type="audio/ogg"></source>
            </audio>
        </div>
    )
}

export default ConversationTab
