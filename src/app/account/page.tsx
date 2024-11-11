import MainLayout from "@/components/MainLayout";
import { Flex } from "antd";
import prisma from 'src/actions/db'

const disconnect = async () => {
  "use server";
  return await prisma.$disconnect()
}


const AccountPage = () => {
  return (
    <MainLayout>
      <Flex
        vertical
        justify="center"
        align="center"
        className="h-full w-full">
            <></>
      </Flex>
    </MainLayout>
  )
};

export default AccountPage;