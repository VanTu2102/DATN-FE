'use client'

import { findAccountByEmail } from "@/controllers/account"
import { findAllRecord } from "@/controllers/conversation"
import { useStore } from "@/store"
import { Button, Flex, Space } from "antd"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface IProps { }

const HomeView: FC<IProps> = ({ }) => {
    useEffect(() => {
        findAccountByEmail(localStorage.getItem('email')).then(async (acc: any) => {
            console.log(await findAllRecord(acc!.id))
        })
    }, [])
    return <>
        <Flex justify="center" align="center">
            <></>
        </Flex>
    </>
}

export default HomeView
