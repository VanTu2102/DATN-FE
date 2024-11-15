'use client'

import { findUniqueRecord } from "@/controllers/conversation"
import { Button, Flex, Space, Tabs } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'
import { formatDuration } from "@/functions/time/time_convert"
import ConversationTab from "@/components/conversation/conversation_tab"

const { TabPane } = Tabs;
interface IProps { }

const CoversationView: FC<IProps> = ({ }) => {
    const [data, setData] = useState<any>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const replay = searchParams.get('replay')
    const id = searchParams.get('id')
    useEffect(() => {
        if (id) {
            findUniqueRecord(parseInt(id)).then((v: any) => {
                if (v) {
                    setData(v)
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
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Conversation" key="1">
                        <ConversationTab data={data} />
                    </TabPane>
                    {replay === "True" ? <TabPane tab="Summary" disabled={data?.transcription === null} key="2">
                        Summary
                    </TabPane> : <></>}
                </Tabs>
            </div>
        </Flex>
    </>
}

export default CoversationView
