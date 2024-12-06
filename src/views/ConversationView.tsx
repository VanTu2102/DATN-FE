'use client'

import { findUniqueRecord } from "@/controllers/conversation"
import { Button, Flex, Space, Tabs } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'
import { formatDuration } from "@/functions/time/time_convert"
import ConversationTab from "@/components/conversation/conversation_tab"
import environment from "@/util/environment"

const { TabPane } = Tabs;
interface IProps { }

const CoversationView: FC<IProps> = ({ }) => {
    const [data, setData] = useState<any>()
    const [time, setTime] = useState<number>(0)
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
    useEffect(() => {
        console.log(data)
    }, [data])
    return <>
        <Flex justify="center" align="center" className="w-full">
            <div className="w-full h-max min-h-26 bg-white border border-[#eeeeee] shadow-md px-6 py-4 flex flex-col font-semibold">
                <span className="text-2xl">{data?.name}</span>
                <div className="flex items-center mt-2">
                    <span className="text-xs py-2 text-[#6c6c6c] flex mr-3"><AiOutlineCalendar className="mr-1" size={16} />{data?.createdDate.toLocaleString()}</span>
                    <span className="text-xs py-2 text-[#6c6c6c] flex"><AiOutlineClockCircle className="mr-1" size={16} />{formatDuration(data?.time ? data?.time : time)}</span>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Conversation" key="1">
                        <ConversationTab data={data} setTimeCounter={setTime} setData={setData} />
                    </TabPane>
                    {replay === "True" ? <TabPane tab="Summary" disabled={data?.transcription === null} key="2">
                        Summary
                        <div className="mt-5">{data?.transcription?.summary ? data?.transcription?.summary : "Chưa có bản tóm tắt!"}</div>
                        {data?.transcription?.summary ?
                            <></> :
                            <Button type="primary" className="my-5 text-[14px] font-semibold" onClick={async () => {
                                const response = await fetch(`${environment.BE_URL}/llm/summarize?id=${data?.transcription?.id}`)
                                const json = await response.json();
                                console.log(json)
                            }}>Tóm tắt</Button>}
                    </TabPane> : <></>}
                </Tabs>
            </div>
        </Flex>
    </>
}

export default CoversationView
