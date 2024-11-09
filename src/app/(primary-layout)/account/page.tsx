import RootPrimary from "@/components/MainRoot";
import { Flex } from "antd";
import prisma from 'src/actions/db'

const disconnect = async () => {
  "use server";
  return await prisma.$disconnect()
}


const AccountPage = () => {
  return (
    <RootPrimary>
      <Flex
        vertical
        justify="center"
        align="center"
        className="tw-h-full tw-w-full">
            <></>
      </Flex>
    </RootPrimary>
  )
};

export default AccountPage;