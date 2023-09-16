// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require("../../util/axios")

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

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "GET":
            getAllPoki()
                .then(resp => {
                    console.log(resp)
                    const results = resp.map(PokiItem => {
                        const result = {}
                        allowedIndices.map(index => {
                            result[index] = PokiItem[index]
                        })
                        return result
                    })
                    console.log("GET / response : ", results)
                    res.status(200).json(results)
                })
                .catch(error => {
                    console.log("GET / error : ", error)
                    res.status(500).send()
                })
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

