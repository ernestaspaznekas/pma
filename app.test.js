const request = require('supertest')

const app = require('./app')

const wallets = [
    {
        name: 'wallet_1',
        currency: 'ETH',
        initialBalance: 2.03,
    },
    {
        name: 'wallet_2',
        currency: 'ETH',
        initialBalance: 0,
    },
]

const txs = [
    {
        from: 0,
        to: 1,
        amount: 0.01,
        currency: "ETH",
    },
    {
        from: 1,
        to: 0,
        amount: 0.005,
        currency: "ETH",
    },
    {
        from: 0,
        to: 1,
        amount: 0.02,
        currency: "ETH",
    },
    {
        from: 1,
        to: 0,
        amount: 2,
        currency: "ETH",
    },
]

describe('Creat wallets', () => {
    it('POST /wallet => create first wallet', () => {
        return (
            request(app)
            .post('/wallet')
            .send(wallets[0])
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        name: wallets[0].name,
                        balance: wallets[0].initialBalance,
                        currency: wallets[0].currency,
                    })
                )
            })
        )
    })

    it('GET /wallet/0 => get firts wallet', () => {
        return (
            request(app)
            .get('/wallet/0')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        name: wallets[0].name,
                        balance: wallets[0].initialBalance,
                        currency: wallets[0].currency,
                        createdAt: expect.any(String),
                        id: 0,
                    })
                )
            })
        )
    })

    it('POST /wallet => create second wallet', () => {
        return (
            request(app)
            .post('/wallet')
            .send(wallets[1])
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        name: wallets[1].name,
                        balance: wallets[1].initialBalance,
                        currency: wallets[1].currency,
                    })
                )
            })
        )
    })


    it('GET /wallet/0 => get second wallet', () => {
        return (
            request(app)
            .get('/wallet/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        name: wallets[1].name,
                        balance: wallets[1].initialBalance,
                        currency: wallets[1].currency,
                        createdAt: expect.any(String),
                        id: 1,
                    })
                )
            })
        )
    })

    it('GET /wallet/2 => get missing wallet', () => {
        return (
            request(app)
            .get('/wallet/2')
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'not found'
                    })
                )
            })
        )
    })
})

describe('Make transactions', () => {
    it('POST /tx => make first tx', () => {
        return (
            request(app)
            .post('/tx')
            .send(txs[0])
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                    })
                )
            })
        )
    })

    it('POST /tx => make second tx', () => {
        return (
            request(app)
            .post('/tx')
            .send(txs[1])
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                    })
                )
            })
        )
    })

    it('POST /tx => make third tx', () => {
        return (
            request(app)
            .post('/tx')
            .send(txs[2])
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                    })
                )
            })
        )
    })

    it('POST /tx => post failing tx', () => {
        return (
            request(app)
            .post('/tx')
            .send(txs[3])
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'invalid balance'
                    })
                )
            })
        )
    })

    it('GET /wallets => compare wallet balance', () => {
        return (
            request(app)
            .get('/wallets')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        wallets: [
                            {
                                balance: 0.025,
                                createdAt: expect.any(String),
                                currency: wallets[1].currency,
                                id: expect.any(Number),
                                name: wallets[1].name,
                                todayBalanceChange: 0.025,
                            },
                            {
                                balance: 2.005,
                                createdAt: expect.any(String),
                                currency: wallets[0].currency,
                                id: expect.any(Number),
                                name: wallets[0].name,
                                todayBalanceChange: -0.025,
                            },
                        ]
                    })
                )
            })
        )
    })
})
