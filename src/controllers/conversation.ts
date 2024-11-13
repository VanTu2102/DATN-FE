"use server"
import Conversation from "@/models/Conversation";

function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}

export const saveRecord = async (accountId: number, name: string, data: string) => {
    const conservation = new Conversation(accountId, name, stringToArrayBuffer(data), new Date())
    return conservation.saveRecord().then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};

// export const signin = async (email: any, password: any) => {
//     "use server";
//     const acc = new Account(email, password)
//     const account = await acc.findAccount()
//     if (account?.password === password) {
//         let objAcc: any = { ...acc }
//         objAcc.password = undefined
//         return jwt.sign(objAcc, password)
//     }
//     return false
// };