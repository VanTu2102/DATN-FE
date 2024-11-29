'use client'

import { findDetailAccountByEmail } from "@/controllers/account"
import { Button, Flex, Space } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface IProps { }

const AccountView: FC<IProps> = ({ }) => {
    const [acc, setAcc] = useState<any>([])
    const searchParams = useSearchParams()
    const router = useRouter()
    const next = searchParams.get('next')
    useEffect(() => {
        findDetailAccountByEmail(localStorage.getItem('email')).then(async (acc: any) => {
            setAcc(acc)
            console.log(acc)
        })
        if (next) {
            router.push(next.replaceAll(',', "&"))
        }
    }, [])

    return <>
        <Flex justify="center" align="center" className="w-full flex-col pt-5">
            <div className="flex w-full p-4 py-2">
                <div className="w-full h-max min-h-26 bg-white border border-[#eeeeee] shadow-md rounded-md px-6 py-4 flex flex-col hover:cursor-pointer">
                </div>
            </div>
        </Flex>
    </>
}

export default AccountView
