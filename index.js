// basic server file
const PORT = 8000
const express = require("express")
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const websites = {
    "eng": [
        {
            name: "destructoid",
            address: "https://www.destructoid.com/?s=delay",
        },
        {
            name: "gamesradar",
            address: "https://www.gamesradar.com/uk/search/?searchTerm=delay",
        },
        {
            name: "gameinformer",
            address: "https://www.gameinformer.com/search?keyword=delay",
        },
        {
            name: "nintendolife",
            address: "https://www.nintendolife.com/search?q=delay&submit=Go",
        },
        {
            name: "gamespot",
            address: "https://www.gamespot.com/search/?header=1&q=delay",
        },
        {
            name: "nichegamer",
            address: "https://nichegamer.com/?s=delay",
        },
        {
            name: "techraptor",
            address: "https://techraptor.net/search",
        },
        {
            name: "pcgamer",
            address: "https://www.pcgamer.com/uk/search/?searchTerm=delay",
        },
        {
            name: "gamedeveloper",
            address: "https://www.gamedeveloper.com/search?q=delay",
        }
    ],
    "pl": [
        {
            name: "ppe",
            address: "https://www.ppe.pl/szukaj.html?fraza=op%C3%B3%C5%BAnienie",
        }
    ]
}

//const articles = []
//
// basic version
// websites["eng"].forEach(website => {
//
//     axios.get(website.address)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html) // allow to get elements from website
//             $('a:contains("delay")').each(function () {
//                 // Get title of article and remove linebreaks
//                 const title = $(this).text().replace(/(\r\n|\n|\r)/gm, "")
//                 const url = $(this).attr('href')
//                 articles.push({
//                     title,
//                     url,
//                     source: website.name
//                 })
//             })
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// })

let promises = []
const gathered_articles = []
//TODO make contains word dependant on lang
const extract_titles = (lang) => {
    websites[lang].forEach(website => {
        promises.push(
            axios.get(website.address)
                .then(response => {
                    return response.data
                })
                .then(result => {
                    const html = result
                    const $ = cheerio.load(html) // allow to get elements from website
                    $('a:contains("delay")').each(function () {
                        // Get title of article and remove linebreaks
                        const title = $(this).text().replace(/(\r\n|\n|\r)/gm, "")
                        const url = $(this).attr('href')
                        gathered_articles.push({
                            title,
                            url,
                            source: website.name
                        })
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        )
    })

}


app.get('/', (request, response) => {
    response.json("Welcome to Game delay radar news API" +
        "")
})


app.get('/news/:lang?', (req, res) => {
    try {
        extract_titles(req.params.lang !== undefined ? req.params.lang : "eng")
        Promise.all(promises)
            .then(() => {
                res.json(gathered_articles)
            })
    } catch (e) {
        console.log(e)
        res.json(["Error: passed language not handled"])
    }
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))



