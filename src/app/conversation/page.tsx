import { Metadata } from 'next'
import { Flex } from "antd"
import MainLayout from '@/components/MainLayout'
import CoversationView from '@/views/ConversationView'

export const metadata: Metadata = {
  title: 'Conversation'
}

export default function ConversationPage() {
  return (
    <MainLayout title='Conversation'>
      <Flex
        vertical
        justify="center"
        align="center"
        className="h-full w-full mt-[64px]">
        <CoversationView />
      </Flex>
    </MainLayout>
  )
}
