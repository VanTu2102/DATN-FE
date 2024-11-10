import { Metadata } from 'next'
import { Flex } from "antd"
import IntroductionView from "@/views/IntroductionView"
import RootPrimary from '@/components/MainRoot'

export const metadata: Metadata = {
  title: 'Next.js - Home'
}

export default function HomePage() {
  return (
    <RootPrimary>
      <Flex
        vertical
        justify="center"
        align="center"
        className="h-full w-full">
        <IntroductionView />
      </Flex>
    </RootPrimary>
  )
}
