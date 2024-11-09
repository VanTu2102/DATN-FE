import prisma from 'src/actions/db'

export default class Account {
    email?: string
    password?: string
    name?: string
    constructor(email?: string, password?: string, name?: string) {
        this.email = email
        this.password = password
        this.name = name
    }

    async createAccount(email: string, password: string) {
        "use server";
        this.email = email
        this.password = password
        const account = await prisma.account.create({
            data: {
                email: email,
                password: password
            }
        })
        return account
    }
}