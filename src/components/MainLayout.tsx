'use client'

import { FC, ReactNode, useMemo, useState } from "react"
import { Layout as AntdLayout, Menu, theme } from 'antd'
import { AiFillBook, AiOutlineMenu } from 'react-icons/ai'
import { MenuItem } from "@/types/layout.type"
import { usePathname, useRouter } from "next/navigation"
import Guard from "./guard"

interface IProps {
  title?: string,
  menuItems?: MenuItem[],
  children?: ReactNode
}

const MainLayout: FC<IProps> = ({
  children, menuItems = [
    {
      icon: <AiFillBook />,
      label: 'Home',
      route: '/home'
    },
  ]
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const { token: { Layout } } = theme.useToken()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("Home")

  const antdMenuItems = useMemo(() => {
    return menuItems.map((v) => ({
      key: `${v.route ?? 'default'}`,
      label: v.label,
      icon: v.icon,
      route: v.route
    }))
  }, [menuItems])

  function handleMenuClicked(key: string) {
    const menuItem = antdMenuItems.find(v => v.key === key)
    if (menuItem?.route) {
      router.push(menuItem.route)
      setTitle(menuItem.label)
    }
  }

  return <AntdLayout style={{ height: '100dvh', overflow: 'hidden' }}>
    <AntdLayout hasSider >
      <AntdLayout.Sider
        width={240}
        style={{ padding: 0 }}
        className={`border-r border-[#c9c9c9] shadow-lg overflow-y-auto`}
        collapsible
        breakpoint="md"
        collapsedWidth={0}
        collapsed={collapsed}
        zeroWidthTriggerStyle={{ overflowY: 'scroll' }}
        onCollapse={setCollapsed}>
        <Menu
          selectedKeys={[pathname]}
          style={{
            height: 'max-content',
            background: Layout?.triggerBg ?? '#fff',
            color: Layout?.triggerColor ?? '#000'
          }}
          mode="inline"
          items={antdMenuItems}
          onClick={(e) => handleMenuClicked(e.key)} />
      </AntdLayout.Sider>
      <AntdLayout.Content
        className="overflow-auto"
        style={{ height: 'calc(100dvh - 64px)' }}>
        <AntdLayout.Header className="flex gap-2 p-4 items-center border-r border-[#c9c9c9] shadow-lg text-white">
          <div className="flex justify-center items-center cursor-pointer p-2" onClick={() => setCollapsed(!collapsed)} >
            <AiOutlineMenu className="cursor-pointer" size={14} />
            <div className="text-[14px] ml-2">{title}</div>
          </div>
        </AntdLayout.Header>
        <Guard />
        {children}
      </AntdLayout.Content>
    </AntdLayout>
  </AntdLayout>
}

export default MainLayout
