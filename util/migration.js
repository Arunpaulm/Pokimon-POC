const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const axios = require("./axios")

const allowedIndices = ['name', 'id', 'stats', 'types']


function getAllPoki() {
    return new Promise((resolve, reject) => {
        axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
            .then(async function (response) {
                const allPoki = []
                response.data.results.map(pokiData => {
                    allPoki.push(axios.get(pokiData.url).then(responseOfOnePoki => responseOfOnePoki.data))
                })
                resolve(await Promise.all(allPoki))
            })
            .catch(function (error) {
                reject(error)
            })
    })
}

getAllPoki()
    .then(async resp => {
        console.log(resp)
        const results = []

        for (const pokiIndex in resp) {
            const poki = resp[pokiIndex]
            const result = {}
            result.id = poki.id
            result.name = poki.name.charAt(0).toUpperCase() + poki.name.slice(1)
            result.type = poki.types?.map(({ type }) => type.name).join(", ")
            poki.stats.map(currentstat =>
                result[currentstat.stat.name?.replace("-", "_")] = currentstat.base_stat
            )
            const createMany = await prisma.pokimon.create({
                data: result
            })
            results.push(result)
        }


        console.log(results)
    })
    .catch(error => {
        console.log("error : ", error)
    })
