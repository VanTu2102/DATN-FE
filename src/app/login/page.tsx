import BodyPage from "@/components/login/body";
import { signin } from "@/controllers/account";
import prisma from 'src/actions/db'

const disconnect = async () => {
  "use server";
  return await prisma.$disconnect()
}

export default function NextLoginPage () {
  return (
    <BodyPage disconnect={disconnect} signin={signin}></BodyPage>
  )
};