"use server"
import Conversation from "@/models/Conversation";

function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

export const saveRecord = async (accountId: number, name: string, data: string) => {
    const conservation = new Conversation(accountId, name, Buffer.from(stringToArrayBuffer(data)), new Date())
    return conservation.saveRecord()!.then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};

export const findUniqueRecord = async (id: any) => {
    const conservation = new Conversation()
    const record = await conservation.findUniqueRecord(id)
    return record
};