// basic server file
const PORT = 8000
const express = require("express")
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");

const app = express()

app.get('/', (request, response) => {
    response.json("Welcome to Game delay radar news API" +
        "")
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))


