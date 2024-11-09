import BodyPage from "@/components/signup/body";
import Account from "@/models/Account";
import { redirect } from "next/navigation";
import prisma from 'src/actions/db'

const account = new Account()
const register = async (email: any, password: any) => {
  "use server";
  return await account.createAccount(email, password)
};

async function disconnect() {
  "use server";
  return await prisma.$disconnect()
}


const RegisterPage = () => {
  return (
    <BodyPage register={register} disconnect={disconnect}></BodyPage>
  )
};

export default RegisterPage;