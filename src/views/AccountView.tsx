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
            <div className="flex w-full justify-center px-8 py-2">
                <div className="w-full max-w-[900px] px-12 bg-white rounded-lg shadow-md flex flex-col">
                    <div className="mt-6 flex justify-between items-center font-semibold">
                        <div className="text-[24px]">Profile</div>
                        <div className="text-blue-500 hover:underline hover:cursor-pointer">Edit</div>
                    </div>
                    <div className="mt-6 grid-cols-2 grid">
                        <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                            <p>Email</p>
                            <p className="font-medium">vantu2102@gmail.com</p>
                        </div>
                        <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                            <p>Password</p>
                            <p className="font-medium">********</p>
                        </div>
                        <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                            <p>Name</p>
                            <p className="font-medium">Hoàng Tú</p>
                        </div>
                    </div>

                    {/* Language Section */}
                    <div className="my-8 border-t pt-4 text-gray-700">
                        <p className="text-sm">Language</p>
                        <select
                            className="mt-2 p-2 w-full border rounded-md text-gray-700 focus:outline-none"
                            defaultValue="Vietnamese"
                        >
                            <option value="English">English</option>
                            <option value="Vietnamese">Vietnamese</option>
                        </select>
                    </div>
                </div>
            </div>
        </Flex>
    </>
}

export default AccountView
