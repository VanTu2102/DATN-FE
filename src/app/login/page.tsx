import { Metadata } from 'next'
import { Flex } from "antd"

export const metadata: Metadata = {
  title: 'Next.js - Home'
}

export default function LoginPage() {
  return <>
    <Flex
      vertical
      justify="center"
      align="center"
      className="tw-h-full tw-w-full">
        <div></div>
    </Flex>
  </>
}
