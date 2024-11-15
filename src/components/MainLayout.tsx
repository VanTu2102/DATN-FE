"use client"

import { FC, ReactNode, useEffect, useMemo, useState } from "react"
import { Layout as AntdLayout, Button, Menu, theme, Modal, Upload, message } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { AiFillBook, AiOutlineMenu } from 'react-icons/ai'
import { MenuItem } from "@/types/layout.type"
import { usePathname, useRouter } from "next/navigation"
import Guard from "./guard"
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { saveRecord } from "@/controllers/conversation";
import { RcFile } from "antd/es/upload";
import { findAccountByEmail } from "@/controllers/account";

interface IProps {
  menuItems?: MenuItem[],
  children?: ReactNode,
  title?: string
}

function uint8ArrayToBase64(uint8Array: any) {
  return Buffer.from(uint8Array).toString('base64');
}

const MainLayout: FC<IProps> = ({
  title, children, menuItems = [
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
  const [tit, setTitle] = useState<string>(title ? title : "Home")
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  const props: UploadProps = {
    maxCount: 1,
    multiple: false,
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onChange: () => {
      if (fileList.length > props.maxCount!) {
        const newFileList = fileList.slice(fileList.length - props.maxCount!, fileList.length);
        setFileList(newFileList);
      }
    },
    fileList,
    accept: '.wav,.mp3'
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (fileList.length < 1) {
      message.warning('Chưa tải lên file')
      return
    }
    setConfirmLoading(true);
    fileList[0].arrayBuffer().then(async (v: any) => {
      const acc = await findAccountByEmail(localStorage.getItem('email'))
      const conversation = await saveRecord(acc!.id, fileList[0].name, uint8ArrayToBase64(v), 'file')
      setOpen(true)
      setConfirmLoading(false)
      router.push(`/conversation?id=${conversation.id}`)
    })
      .catch((e: any) => {
        console.error(e)
      })
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
        className={`border-r border-[#c9c9c9] shadow-lg ${menuItems.length > 5 ? 'overflow-y-auto' : ''}`}
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
            minHeight: 'calc(100% + 40px)',
            background: Layout?.triggerBg ?? '#fff',
            color: Layout?.triggerColor ?? '#000'
          }}
          mode="inline"
          className="font-semibold text-black"
          items={antdMenuItems}
          onClick={(e) => handleMenuClicked(e.key)} />
      </AntdLayout.Sider>
      <AntdLayout.Content
        className="overflow-auto"
        style={{ height: 'calc(100dvh - 64px)' }}>
        <AntdLayout.Header className="flex justify-between gap-2 p-4 items-center border-r bg-white border-[#c9c9c9] shadow-lg text-black">
          <div className="flex justify-center items-center cursor-pointer p-2 font-semibold" onClick={() => setCollapsed(!collapsed)} >
            <AiOutlineMenu className="cursor-pointer" size={14} />
            <div className="text-[14px] ml-2">{tit}</div>
          </div>
          {title !== "Conversation" ?
            <><div>
              <Button type="primary" className="mr-2 text-[14px] font-semibold">Record</Button>
              <Button type="default" className="text-[14px] font-semibold" onClick={showModal}>Import</Button>
            </div>
              <Modal
                title="Tải lên tệp"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <Upload {...props}>
                  <Button icon={<UploadOutlined />} className="flex">Select File</Button>
                  <p className="text-xs mt-2">
                    Support for MP3, WAV
                  </p>
                </Upload>
              </Modal></>
            : <></>}
        </AntdLayout.Header>
        <Guard>
          {children}
        </Guard>
      </AntdLayout.Content>
    </AntdLayout>
  </AntdLayout>
}

export default MainLayout
