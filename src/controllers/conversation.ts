"use server"
import Conversation from "@/models/Conversation";

function base64ToUint8Array(base64: any) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export const saveRecord = async (accountId: number, name: string, data: string) => {
    const conservation = new Conversation(accountId, name, Buffer.from(base64ToUint8Array(data)), new Date())
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