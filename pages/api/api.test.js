const { createMocks } = require('node-mocks-http')
const api = require('./api')

describe('Poki Api testing : Endpoint /api/api', () => {
    test('Send Get request; returns a list of pokimon', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        })

        await api(req, res)

        var data = res._getJSONData();

        expect(res.statusCode).toEqual(200)
        expect(data?.length).toEqual(151)
        expect(data?.[0]).toEqual(
            {
                id: 1,
                name: 'Bulbasaur',
                type: 'grass, poison',
                hp: 45,
                attack: 49,
                defense: 49,
                special_attack: 65,
                special_defense: 65,
                speed: 45
            })
    })

    test('Send Options request; returns Allowed Methods', async () => {
        const { req, res } = createMocks({
            method: 'OPTIONS',
        })

        await api(req, res)

        expect(res.statusCode).toEqual(204)
        expect(res._getHeaders().allow).toEqual(["GET"])
    })

    test('Send Post request; returns Method Not Allowed', async () => {
        const { req, res } = createMocks({
            method: 'POST',
        })

        await api(req, res)

        expect(res.statusCode).toEqual(405)
        expect(res._isEndCalled()).toEqual(true)
    })
})
