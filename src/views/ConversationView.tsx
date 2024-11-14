'use client'

import { findUniqueRecord } from "@/controllers/conversation"
import { useStore } from "@/store"
import { Button, Flex, Space } from "antd"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface IProps { }

const CoversationView: FC<IProps> = ({ }) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')
    useEffect(() => {
        if (id) {
            findUniqueRecord(parseInt(id)).then((v: any) => {
                console.log(v);
                if(v){
                }
                else{
                    router.push('/home')
                }
            })
        }
        else {
            router.push('/home')
        }
    }, [id])
    return <>
        <Flex justify="center" align="center">
            <></>
        </Flex>
    </>
}

export default CoversationView
