const express       = require('express')

const router        = express.Router()


const wallets       = []
const txs           = []

router.post('/wallet', function (req , res) {
    const { body: { name, currency, initialBalance } } = req
    const id = Number(wallets.length)

    wallets.push({
        id,
        name,
        currency,
        balance: Number(initialBalance),
        todayBalanceChange: 0,
        createdAt: new Date,
    })

    res.json({ id, name, currency, balance: initialBalance })
})

router.get('/wallet/:id', function (req , res, next) {
    const wallet = wallets.find(
        ({ id }) => id === Number(req.params.id)
    )

    if (!wallet) {
        return res.status(404).json({ message: 'not found' })
    }

    res.json(wallet)
})

router.get('/wallets', function (req , res) {
    res.json({ wallets: wallets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )})
})

router.post('/tx', function (req , res) {
    const { body: { from, to, amount, currency } } = req

    txs.push({ from, to, amount, currency })

    const wFrom     = wallets.find(({ id }) => id === Number(from))
    const wTo       = wallets.find(({ id }) => id === Number(to))

    if (wFrom.balance < amount) {
        return res.status(404).json({ message: 'invalid balance' })
    }

    wFrom.balance               -= Number(amount)
    wFrom.todayBalanceChange    -= Number(amount)

    wTo.balance                 += Number(amount)
    wTo.todayBalanceChange      += Number(amount)

    res.json({ success: true })
})

module.exports = router