"use server"
import { base64ToUint8Array } from "@/functions/data_convert/data_convert";
import Conversation from "@/models/Conversation";

const conservation_global = new Conversation()

export const saveRecord = async (accountId: number, name: string, type: 'file' | 'live', data?: string, time?: number) => {
    const conservation = new Conversation(accountId, name, data ? Buffer.from(base64ToUint8Array(data)) : undefined, new Date(), type === "file" ? 1 : 2, time)
    return conservation.saveRecord()!.then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};

export const findUniqueRecord = async (id: any) => {
    const record = await conservation_global.findUniqueRecord(id)
    return record
};

export const findAllRecord = async (accountId: any) => {
    const record = await conservation_global.findAllRecord(accountId)
    return record
};

export const updateRecord = async (id: number, name?: string, data?: string, time?: number) => {
    const conservation = new Conversation(undefined, name, data ? Buffer.from(base64ToUint8Array(data)) : undefined, undefined, undefined, time)
    return conservation.updateRecord(id)!.then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};