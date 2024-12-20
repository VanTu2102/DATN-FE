"use client"

import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Layout as AntdLayout, Button, Menu, theme, Modal, Upload, message } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'
import { MenuItem } from "@/types/layout.type"
import { usePathname, useRouter } from "next/navigation"
import Guard from "./guard"
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { saveRecord } from "@/controllers/conversation";
import { RcFile } from "antd/es/upload";
import { findAccountByEmail } from "@/controllers/account";
import { uint8ArrayToBase64 } from "@/functions/data_convert/data_convert";
import { getAudioDurationFromBuffer } from "@/functions/audio/audio_process";

interface IProps {
  menuItems?: MenuItem[],
  children?: ReactNode,
  title?: string
}
const MainLayout: FC<IProps> = ({
  title, children, menuItems = [
    {
      icon: <AiOutlineHome />,
      label: 'Home',
      route: '/home'
    },
    {
      icon: <AiOutlineSetting />,
      label: 'Account',
      route: '/account'
    },
  ]
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const { token: { Layout } } = theme.useToken()
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
    accept: '.wav'
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
    fileList[0].arrayBuffer().then((v: any) => {
      getAudioDurationFromBuffer(new Uint8Array(v)).then(async (time: any) => {
        const acc = await findAccountByEmail(localStorage.getItem('email'))
        const conversation = await saveRecord(acc!.id, fileList[0].name, 'file', uint8ArrayToBase64(v), time)
        setOpen(true)
        setConfirmLoading(false)
        router.push(`/conversation?id=${conversation.id}&replay=True`)
      })
    })
      .catch((e: any) => {
        console.error(e)
      })
  };
  const transcription_live = async () => {
    const acc = await findAccountByEmail(localStorage.getItem('email'))
    const conversation = await saveRecord(acc!.id, `Record at ${new Date().toLocaleString()}`, 'live', undefined, undefined)
    router.push(`/conversation?id=${conversation.id}&replay=False`)
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
      setTitle(menuItem.label)
      router.push(menuItem.route)
    }
  }

  return <AntdLayout style={{ height: '100dvh', overflow: 'hidden' }}>
    <AntdLayout hasSider >
      <AntdLayout.Sider
        width={180}
        style={{ padding: 0 }}
        className={`border-r border-[#c9c9c9] shadow-lg ${menuItems.length > 5 ? 'overflow-y-auto' : ''}`}
        collapsible
        breakpoint="md"
        collapsedWidth={0}
        collapsed={false}
        zeroWidthTriggerStyle={{ overflowY: 'scroll' }}>
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
        style={{ height: 'calc(100dvh)' }}>
        <AntdLayout.Header style={{width: 'calc(100dvw - 180px)'}} className="fixed top-0 flex justify-between gap-2 p-4 items-center border-b bg-white border-[#eeeeee] shadow-lg text-black">
          <div className="flex justify-center items-center cursor-pointer p-2 font-semibold">
            <div className="text-[14px]">{tit}</div>
          </div>
          {title !== "Conversation" ?
            <><div>
              <Button type="primary" className="mr-2 text-[14px] font-semibold" onClick={transcription_live}>Record</Button>
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
                    Support for WAV file
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
