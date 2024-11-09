import Account from "@/models/Account";
import * as jwt from "jsonwebtoken"

export const register = async (email: any, password: any) => {
    "use server";
    const acc = new Account(email, password)
    return acc.createAccount().then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};

export const signin = async (email: any, password: any) => {
    "use server";
    const acc = new Account(email, password)
    const account = await acc.findAccount()
    if (account?.password === password) {
        let objAcc: any = { ...acc }
        objAcc.password = undefined
        return jwt.sign(objAcc, password)
    }
    return false
};