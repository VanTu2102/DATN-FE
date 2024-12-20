"use server"
import { base64ToUint8Array } from "@/functions/data_convert/data_convert";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import Transcription from "@/models/Transcription";

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
    const record: any = await conservation_global.findUniqueRecord(id)
    let new_obj = {
        ...record,
        data: record?.data ? record?.data.toString('base64') : undefined
    }
    return new_obj
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

export const createTranscription = async (conversationId: number) => {
    const transcription = new Transcription(conversationId)
    return transcription.createTranscription()!.then((v: any) => {
        return v.id
    }).catch((e: any) => {
        return "Error"
    })
};

export const updateMessage = async (id: number,
    speaker: string,
    transcriptionId: number,
    start_time: number,
    end_time: number,
    transcript: string,
    correct_transcript?: string) => {
    const message = new Message(id, speaker, transcriptionId, start_time, end_time, transcript, correct_transcript)
    return message.updateMessage(id)!.then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};

export const createMessage = async (
    speaker: string,
    transcriptionId: number,
    start_time: number,
    end_time: number,
    transcript: string,
    correct_transcript?: string) => {
    const message = new Message(undefined, speaker, transcriptionId, start_time, end_time, transcript, correct_transcript)
    return message.createMessage()!.then((v: any) => {
        return v
    }).catch((e: any) => {
        return "Error"
    })
};