import prisma from 'src/actions/db'

export default class Conversation {
    name?: string
    data?: Buffer
    createdDate?: Date
    accountId?: number
    type?: number
    time?: number
    constructor(accountId?: number, name?: string, data?: Buffer, createdDate?: Date, type?: number, time?: number) {
        this.name = name
        this.data = data
        this.createdDate = createdDate ? createdDate : new Date()
        this.accountId = accountId
        this.type = type
        this.time = time
    }

    saveRecord() {
        "use server";
        if (this.name && this.accountId && this.type) {
            return prisma.conversation.create({
                data: {
                    name: this.name,
                    createdDate: this.createdDate,
                    data: this.data,
                    accountId: this.accountId,
                    type: this.type,
                    time: this.time
                }
            })
        }
    }

    updateRecord(id: number) {
        "use server";
        return prisma.conversation.update({
            where: {
                id: id
            },
            data: {
                name: this.name,
                data: this.data,
                time: this.time
            },
            select: {
                id: true,
                name: true,
                createdDate: true,
                type: true,
                transcription: {
                    select: {
                        data: true,
                        conversationId: true,
                        id: true,
                        summary: true
                    }
                },
                data: true,
                time: true
            }
        })
    }

    findUniqueRecord(id: number) {
        "use server";
        return prisma.conversation.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                createdDate: true,
                type: true,
                transcription: {
                    select: {
                        data: {
                            orderBy: {
                                id: 'asc' // Sắp xếp theo id tăng dần, dùng 'desc' nếu muốn giảm dần
                            },
                            select: {
                                id: true,
                                transcriptionId: true,
                                transcript: true,
                                start_time: true,
                                end_time: true,
                                correct_transcript: true,
                                speaker: true
                            }
                        },
                        conversationId: true,
                        id: true,
                        summary: true
                    }
                },
                data: true,
                time: true
            }
        })
    }

    findAllRecord(accountId: number) {
        "use server";
        return prisma.conversation.findMany({
            where: {
                accountId: accountId
            },
            select: {
                id: true,
                name: true,
                createdDate: true,
                accountId: false,
                type: true,
                transcription: false,
                account: false,
                data: false,
                time: true
            }
        })
    }
}