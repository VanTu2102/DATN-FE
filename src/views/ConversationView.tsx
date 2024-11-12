'use client'

import { useStore } from "@/store"
import { Button, Flex, Space } from "antd"
import Image from "next/image"
import { FC, useEffect, useState } from "react"

interface IProps { }

const CoversationView: FC<IProps> = ({ }) => {
    const { counter, setCounter } = useStore()
    const [timeCounter, setTimeCounter] = useState<number>(0)
    useEffect(() => {
        function tick() {
            setTimeCounter((v) => v + 1)
        }
        const intervalTick = setInterval(tick, 1000)
        return () => {
            clearInterval(intervalTick)
        }
    }, [])
    return <>
        <Flex justify="center" align="center">
            <></>
        </Flex>
    </>
}

export default CoversationView
