import prisma from 'src/actions/db'

export default class Account {
    email: string
    password?: string
    name?: string
    type?: 'google' | undefined
    language?: string
    constructor(email: string, password?: string, name?: string, type?: 'google' | undefined, language?: string) {
        this.email = email
        this.password = password
        this.name = name
        this.type = type
        this.language = language ? language : 'vi'
    }

    createAccount() {
        "use server";
        if (this.password) {
            return prisma.account.create({
                data: {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    language: this.language,
                    type: this.type
                }
            })
        }
    }

    updateAccount(id: number) {
        "use server";
        if (this.password) {
            return prisma.account.update({
                where: {
                    id: id
                },
                data: {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    language: this.language,
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