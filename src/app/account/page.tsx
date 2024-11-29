import MainLayout from "@/components/MainLayout";
import AccountView from "@/views/AccountView";
import { Flex } from "antd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Account'
}


const AccountPage = () => {
  return (
    <MainLayout title="Account">
      <Flex
        vertical
        justify="center"
        align="center"
        className="h-full w-full mt-[64px]">
        <AccountView />
      </Flex>
    </MainLayout>
  )
};

export default AccountPage;