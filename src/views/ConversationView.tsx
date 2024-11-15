'use client'

import { findUniqueRecord } from "@/controllers/conversation"
import { Button, Flex, Space } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'
import { formatDuration } from "@/functions/time/time_convert"

interface IProps { }

const CoversationView: FC<IProps> = ({ }) => {
    const [data, setData] = useState<any>()
    const [dataAudioSource, setDataAudioSource] = useState<any>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')
    useEffect(() => {
        if (id) {
            findUniqueRecord(parseInt(id)).then((v: any) => {
                console.log(v);
                if (v) {
                    setData(v)
                    setDataAudioSource(Buffer.from(v.data.data))
                    console.log(Buffer.from(v.data.data))
                }
                else {
                    router.push('/home')
                }
            })
        }
        else {
            router.push('/home')
        }
    }, [id])
    return <>
        <Flex justify="center" align="center" className="w-full">
            <div className="w-full h-max min-h-26 bg-white border border-[#eeeeee] shadow-md px-6 py-4 flex flex-col font-semibold">
                <span className="text-2xl">{data?.name}</span>
                <div className="flex items-center mt-2">
                    <span className="text-xs py-2 text-[#6c6c6c] flex mr-3"><AiOutlineCalendar className="mr-1" size={16} />{data?.createdDate.toLocaleString()}</span>
                    <span className="text-xs py-2 text-[#6c6c6c] flex"><AiOutlineClockCircle className="mr-1" size={16} />{formatDuration(data?.time)}</span>
                </div>
            </div>
            {/* <audio controls className="w-full bg-white mt-4 p-1 rounded-full">
                <source src="horse.ogg" type="audio/ogg"></source>
            </audio> */}
            <></>
        </Flex>
    </>
}

export default CoversationView
