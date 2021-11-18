const express = require('express')
const app = express()
const cors = require('cors')

const symbols = require("./symbols.json")
const rateLimits = require("./rateLimits.json")

//file system
const fs = require("fs");
const http = require('http')

//CSV to JSON
const csv = require('csvtojson')

let time = {serverTime: Date.now()}

app.use(cors())
app.options('*', cors())

function getInterval(value) {
    const intervals = {
        '1': '1m',
        '3': '3m',
        '5': '5m',
        '15': '15m',
        '30': '30m',
        '60': '1h',
        '120': '2h',
        '240': '4h',
        '360': '6h',
        '480': '8h',
        '720': '12h',
        'D': '1d',
        '1D': '1d',
        '3D': '3d',
        'W': '1w',
        '1W': '1w',
        'M': '1M',
        '1M': '1M',
    }
    return Object.keys(intervals).find(key => intervals[key] === value);
}

app.get('/klines', (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    const interval = getInterval(request.query.interval)
    const csvFilePath = `EURUSD${interval}.csv`

    //Скачиваем файл
    const file = fs.createWriteStream(csvFilePath)
    http.get(`http://mt1.xstm.work/${csvFilePath}`, result => {
        result.pipe(file)
        file.on('finish', () => {
            file.close(() => {
                csv()
                    .fromFile(csvFilePath)
                    .then((json) => {
                        response.send(JSON.stringify(json))
                        fs.unlink(csvFilePath, () => {})
                    })
            })
        })
    })

})

app.get('/time', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(time))
})

app.get('/exchangeInfo', (req, res) => {
    let exchangeInfo = {}
    res.setHeader('Content-Type', 'application/json')
    exchangeInfo.timezone = 'UTC'
    exchangeInfo.symbols = symbols
    exchangeInfo.rateLimits = rateLimits
    exchangeInfo.serverTime = time
    exchangeInfo.exchangeFilters = []
    res.send(JSON.stringify(exchangeInfo))
})

app.listen(3001, ()=> console.log('Data server is listened on a port 3001'))