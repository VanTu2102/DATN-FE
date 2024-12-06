import prisma from 'src/actions/db'

export default class Transcription {
    id?: number
    createdDate: Date
    conversationId: number
    summary?: string
    constructor(
        conversationId: number,
        id?: number,
        createdDate?: Date,
        summary?: string) {
        this.id = id
        this.conversationId = conversationId
        this.summary = summary
        this.createdDate = createdDate ? createdDate : new Date()
    }
    createTranscription() {
        "use server";
        return prisma.transcription.create({
            data: {
                conversationId: this.conversationId,
                createdDate: this.createdDate,
                summary: this.summary
            }
        })
    }
}