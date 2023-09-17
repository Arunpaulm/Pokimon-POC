const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = {
    getAllPokimon: async () => {
        const pokimon = await prisma.pokimon.findMany()
        return pokimon
    }
}
