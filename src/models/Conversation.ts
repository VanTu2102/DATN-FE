import prisma from 'src/actions/db'

export default class Conversation {
    name: string
    data: ArrayBuffer
    createdDate: Date
    accountId: number
    constructor(accountId: number, name: string, data: ArrayBuffer, createdDate?: Date) {
        this.name = name
        this.data = data
        this.createdDate = createdDate ? createdDate : new Date()
        this.accountId = accountId
    }

    saveRecord() {
        "use server";
        return prisma.conversation.create({
            data: {
                name: this.name,
                createdDate: this.createdDate,
                data: Buffer.from(this.data),
                accountId: this.accountId
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