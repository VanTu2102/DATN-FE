import { ConfigProvider } from 'antd'
import { ZustandHydration } from '@/store'

import MainLayout from '@/components/MainLayout'
import { AiFillBook } from 'react-icons/ai'

export default function RootTemplate({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ZustandHydration>
      <ConfigProvider theme={{
        components: {
          Layout: {
            headerBg: '#1890ff',
            triggerBg: '#fff',
            triggerColor: '#000',
            zeroTriggerWidth: 0
          }
        }
      }}>
        {children}
      </ConfigProvider>
    </ZustandHydration>
  )
}
