'use client'

import ConversationCard from "@/components/home/conversation_card"
import { findAccountByEmail } from "@/controllers/account"
import { findAllRecord } from "@/controllers/conversation"
import { Button, Flex, Space } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface IProps { }

const HomeView: FC<IProps> = ({ }) => {
    const [lstRecord, setLstRecord] = useState<any>([])
    const searchParams = useSearchParams()
    const router = useRouter()
    const next = searchParams.get('next')
    useEffect(() => {
        findAccountByEmail(localStorage.getItem('email')).then(async (acc: any) => {
            setLstRecord(await findAllRecord(acc!.id))
        })
        if(next){
            router.push(next.replaceAll(',',"&"))
        }
    }, [])
    
    return <>
        <Flex justify="center" align="center" className="w-full flex-col pt-5">
            {
                lstRecord.map((v: any) => {
                    return <div key={v.id} className="flex w-full p-4 py-2">
                        <ConversationCard data={v}></ConversationCard>
                    </div>
                })
            }
        </Flex>
    </>
}

export default HomeView
