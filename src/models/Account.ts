import prisma from 'src/actions/db'

export default class Account {
    email: string
    password: string
    name?: string
    constructor(email: string, password: string, name?: string) {
        this.email = email
        this.password = password
        this.name = name
    }

    createAccount() {
        "use server";
        return prisma.account.create({
            data: {
                email: this.email,
                password: this.password
            }
        })
    }

    findAccount() {
        "use server";
        return prisma.account.findUnique({
            where: {
                email: this.email
            }
        })
    }
}