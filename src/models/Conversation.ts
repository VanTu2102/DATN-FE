import prisma from 'src/actions/db'

export default class Conversation {
    name?: string
    data?: Buffer
    createdDate?: Date
    accountId?: number
    type?: number
    constructor(accountId?: number, name?: string, data?: Buffer, createdDate?: Date, type?: number) {
        this.name = name
        this.data = data
        this.createdDate = createdDate ? createdDate : new Date()
        this.accountId = accountId
        this.type = type
    }

    saveRecord() {
        "use server";
        if (this.name && this.data && this.accountId && this.type) {
            return prisma.conversation.create({
                data: {
                    name: this.name,
                    createdDate: this.createdDate,
                    data: this.data,
                    accountId: this.accountId,
                    type: this.type
                }
            })
        }
    }

    findUniqueRecord(id: number) {
        "use server";
        return prisma.conversation.findUnique({
            where: {
                id: id
            }
        })
    }

    findAllRecord(accountId: number) {
        "use server";
        return prisma.conversation.findMany({
            where: {
                accountId: accountId
            },
            select:{
                id: true,
                name: true,
                createdDate: true,
                accountId: false,
                type: true,
                transcription: true,
                account: false,
                data: false
            }
        })
    }

    // findAccount() {
    //     "use server";
    //     return prisma.account.findUnique({
    //         where: {
    //             email: this.email
    //         }
    //     })
    // }
}