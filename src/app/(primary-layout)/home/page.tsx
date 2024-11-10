import { Metadata } from 'next'
import { Flex } from "antd"
import IntroductionView from "@/views/IntroductionView"
import MainLayout from '@/components/MainLayout'
import { AiFillBook } from 'react-icons/ai'

export const metadata: Metadata = {
  title: 'Next.js - Home'
}

export default function HomePage() {
  return (

    <MainLayout
      title='Sample Layout'
      menuItems={[
        {
          icon: <AiFillBook />,
          label: 'Home',
          route: '/home'
        },
      ]}>
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
