// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require("../../util/axios")
const dal = require("../../util/dal")

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const getAllPoki = await dal.getAllPokimon()
                console.log(getAllPoki)
                res.status(200).json(getAllPoki)
            } catch (error) {
                console.log("GET / error : ", error)
                res.status(500).send()
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

