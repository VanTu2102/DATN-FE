import prisma from 'src/actions/db'

export default class Account {
    email: string
    password?: string
    name?: string
    type?: 'google' | undefined
    constructor(email: string, password?: string, name?: string, type?: 'google' | undefined) {
        this.email = email
        this.password = password
        this.name = name
        this.type = type
    }

    createAccount() {
        "use server";
        if (this.password) {
            return prisma.account.create({
                data: {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    type: this.type
                }
            })
        }
    }

    findAccount(password?: boolean) {
        "use server";
        return prisma.account.findUnique({
            where: {
                email: this.email
            },
            select: {
                id: true,
                email: true,
                password: password ? true : false,
                name: true
            }
        })
    }

    findDetailAccount() {
        "use server";
        return prisma.account.findUnique({
            where: {
                email: this.email
            }
        })
    }
}