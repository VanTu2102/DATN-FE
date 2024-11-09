import BodyPage from "@/components/signup/body";
import { register, signin } from "@/controllers/account";
import prisma from 'src/actions/db'

const disconnect = async () => {
  "use server";
  return await prisma.$disconnect()
}


const AccountPage = () => {
  return (
    <></>
  )
};

export default AccountPage;