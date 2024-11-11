import { Metadata } from 'next'
import { Flex } from "antd"
import IntroductionView from "@/views/IntroductionView"
import MainLayout from '@/components/MainLayout'

export const metadata: Metadata = {
  title: 'Next.js - Home'
}

export default function HomePage() {
  return (
    <MainLayout>
      <Flex
        vertical
        justify="center"
        align="center"
        className="h-full w-full">
        <IntroductionView />
      </Flex>
    </MainLayout>
  )
}
