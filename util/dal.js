import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllPokimon = async () => {
    const pokimon = await prisma.pokimon.findMany()
    console.log("file - ", pokimon)
    return pokimon
}
