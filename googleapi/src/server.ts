import express from 'express'

import router from './routes'
const IP = require('ip');

const app = express()

app.use(express.json())
app.get('/', (req, res) => {
    const ipAddress = IP.address();
    res.send(ipAddress)
})
app.use(router)

app.listen(3333, () => console.log("Listening on port 3333"))