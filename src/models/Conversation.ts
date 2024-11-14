import prisma from 'src/actions/db'

export default class Conversation {
    name?: string
    data?: Buffer
    createdDate?: Date
    accountId?: number
    constructor(accountId?: number, name?: string, data?: Buffer, createdDate?: Date) {
        this.name = name
        this.data = data
        this.createdDate = createdDate ? createdDate : new Date()
        this.accountId = accountId
    }

    saveRecord() {
        "use server";
        if (this.name && this.data && this.accountId) {
            return prisma.conversation.create({
                data: {
                    name: this.name,
                    createdDate: this.createdDate,
                    data: this.data,
                    accountId: this.accountId
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

    // findAccount() {
    //     "use server";
    //     return prisma.account.findUnique({
    //         where: {
    //             email: this.email
    //         }
    //     })
    // }
}