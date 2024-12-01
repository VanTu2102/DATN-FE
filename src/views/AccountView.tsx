'use client'

import { findDetailAccountByEmail } from "@/controllers/account"
import { Button, Flex, Modal, Input } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface IProps { }

const AccountView: FC<IProps> = ({ }) => {
    const [formData, setFormData] = useState({
        email: "vantu2102@gmail.com",
        password: "abc",
        name: "Hoàng Tú",
    });
    const searchParams = useSearchParams()
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const next = searchParams.get('next')

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        findDetailAccountByEmail(localStorage.getItem('email')).then(async (acc: any) => {
            // setAcc(acc)
            console.log(acc)
        })
        if (next) {
            router.push(next.replaceAll(',', "&"))
        }
    }, [])

    const handleCancel = () => {
        setOpen(false);
    };
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
    };

    return <>
        <Flex justify="center" align="center" className="w-full flex-col pt-5">
            <div className="flex w-full justify-center px-8 py-2">
                <div className="w-full max-w-[900px] px-12 bg-white rounded-lg shadow-md flex flex-col">
                    <div className="mt-6 flex justify-between items-center font-semibold">
                        <div className="text-[24px]">Profile</div>
                        <div className="text-blue-500 hover:underline hover:cursor-pointer" onClick={showModal}>Edit</div>
                        <Modal
                            title="Profile"
                            open={open}
                            onOk={handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                        >
                            <div>
                                <div className="mt-2 flex flex-col">
                                    <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                                        <p>Email</p>
                                        <Input className="py-2 mt-2"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}></Input>
                                    </div>
                                    <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                                        <p>Password</p>
                                        <Input className="py-2 mt-2"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange} type="password"></Input>
                                    </div>
                                    <div className="flex justify-between flex-col items-start mt-4 text-gray-700">
                                        <p>Name</p>
                                        <Input className="py-2 mt-2"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}></Input>
                                    </div>
                                </div>
                            </div>
                        </Modal>
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
                    <div className="mt-8 border-t pt-4 text-gray-700">
                        <p className="text-sm">Language</p>
                        <select
                            className="mt-2 p-2 w-full border rounded-md text-gray-700 focus:outline-none"
                            defaultValue="vi"
                        >
                            <option value="en">English</option>
                            <option value="vi">Vietnamese</option>
                        </select>
                    </div>
                    <div className="my-8 border-t pt-4 flex w-full justify-end">
                        <Button type="primary" className=" font-semibold">Save</Button>
                    </div>
                </div>
            </div>
        </Flex>
    </>
}

export default AccountView
