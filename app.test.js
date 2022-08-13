const request   = require('supertest')

const app       = require('./app')

const wallets = [
    {
        name:           'wallet_1',
        currency:       'ETH',
        initialBalance: 2.03,
    },
    {
        name:           'wallet_2',
        currency:       'ETH',
        initialBalance: 0,
    },
]

const txs = [
    {
        from:       0,
        to:         1,
        amount:     0.01,
        currency:   'ETH',
    },
    {
        from:       1,
        to:         0,
        amount:     0.005,
        currency:   'ETH',
    },
    {
        from:       0,
        to:         1,
        amount:     0.02,
        currency:   'ETH',
    },
    {
        from:       1,
        to:         0,
        amount:     2,
        currency:   'ETH',
    },
]

describe('Test wallet', () => {
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
                        name:       wallets[0].name,
                        balance:    wallets[0].initialBalance,
                        currency:   wallets[0].currency,
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
                        balance:    wallets[0].initialBalance,
                        createdAt:  expect.any(String),
                        currency:   wallets[0].currency,
                        id:         0,
                        name:       wallets[0].name,
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
                        balance:    wallets[1].initialBalance,
                        currency:   wallets[1].currency,
                        name:       wallets[1].name,
                    })
                )
            })
        )
    })


    it('GET /wallet/1 => get second wallet', () => {
        return (
            request(app)
            .get('/wallet/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        balance:    wallets[1].initialBalance,
                        createdAt:  expect.any(String),
                        currency:   wallets[1].currency,
                        id:         1,
                        name:       wallets[1].name,
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
                        message: 'not found'
                    })
                )
            })
        )
    })
})

describe('Test transactions', () => {
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
                                balance:            0.025,
                                createdAt:          expect.any(String),
                                currency:           wallets[1].currency,
                                id:                 expect.any(Number),
                                name:               wallets[1].name,
                                todayBalanceChange: 0.025,
                            },
                            {
                                balance:            2.005,
                                createdAt:          expect.any(String),
                                currency:           wallets[0].currency,
                                id:                 expect.any(Number),
                                name:               wallets[0].name,
                                todayBalanceChange: -0.025,
                            },
                        ]
                    })
                )
            })
        )
    })
})
