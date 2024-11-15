import { Metadata } from 'next'
import { Flex } from "antd"
import HomeView from "@/views/HomeView"
import MainLayout from '@/components/MainLayout'

export const metadata: Metadata = {
  title: 'Home'
}

export default function HomePage() {
  return (
    <MainLayout>
      <Flex
        vertical
        justify="center"
        align="center"
        className="h-full w-full">
        <HomeView />
      </Flex>
    </MainLayout>
  )
}
