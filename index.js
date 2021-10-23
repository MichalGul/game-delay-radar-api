// basic server file
const PORT = 8000
const express = require("express")
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const websites = [
    {}
]

const articles = []

app.get('/', (request, response) => {
    response.json("Welcome to Game delay radar news API" +
        "")
})

//TODO add news with language
app.get('/news', (req, res) => {
    axios.get(`https://www.gamesradar.com/uk/search/?searchTerm=delay`)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html) // allow to get elements from website

            // a tag contains word delay
            $('a:contains("delay")').each(function () {
                // Get title of article and remove linebreaks
                const title = $(this).text().replace(/(\r\n|\n|\r)/gm, "")
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url
                })
            })
            res.json(articles)
        })
        .catch((err) => console.error(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))


