"use server";
import Account from "@/models/Account";
import * as jwt from "jsonwebtoken"

export const register = async (email: any, password: any, name?: string, type?: 'google' | undefined) => {
    const acc = new Account(email, password, name, type)
    return acc.createAccount()!.then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};

export const signin = async (email: any, password: any) => {
    const acc = new Account(email, password)
    const account = await acc.findAccount(true)
    if (account?.password === password) {
        let objAcc: any = { ...acc }
        objAcc.password = undefined
        return jwt.sign(objAcc, password)
    }
    return false
};

export const updateAccount = async (id: number, email: any, password: any, name?: string, type?: 'google' | undefined, language?: string) => {
    const acc = new Account(email, password, name, type, language)
    const account = await acc.updateAccount(id)
    return account
};

export const findAccountByEmail = async (email: any) => {
    const acc = new Account(email)
    const account = await acc.findAccount(false)
    return account
};

export const findDetailAccountByEmail = async (email: any) => {
    const acc = new Account(email)
    const account = await acc.findDetailAccount()
    return account
};