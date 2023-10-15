
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const port = 3000


const articles = []
let img = ""
let review = ""
app.get('/', (req, res) => res.json('Toronto Hotels api!'))

app.get('/news', (req, res) => {
    
    axios.get('https://www.booking.com/searchresults.html?label=gen173nr-1BCBcoggI46AdIM1gEaCeIAQGYATG4ARfIAQzYAQHoAQGIAgGoAgO4AvT1q6kGwAIB0gIkMGIxZTJkY2QtM2I2Zi00MjRjLWE2NzctMzlmNGNhY2FjZGI42AIF4AIB&sid=8d60daf64587cd930b400a0bcf94140c&aid=304142&dest_id=-574890&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=2&order=distance_from_search&offset=0')
        .then((response)=> {
            const html = response.data
            //const base = "https://www.theguardian.com"
            
            const $ = cheerio.load(html)
            $('a[data-testid="title-link"]', html).each(function () {

                let title = $(this).text()
                title = title.toString().replace('Opens in new window', '')
                title = title.toString().replace(/\t/g, '').split('\r\n');
                title = title.toString().replace(/\n/g, ' ').split('\r\n');
                const url = $(this).attr('href')
                
                //const urlBase = base + url
                
                $('img[alt="'+ title +'"]', html).each(function () {
                    img = $(this).attr('src')
                 
                })

                $('a[href="'+ url +'"] div[data-testid="review-score"]', html).each(function () {
                    
                    review = $(this).text().replace(/([A-Z])/g, ' $1').trim()
               })
               

                articles.push({
                    title,
                    url,
                    img,
                    review
                })
               
              
            })
            res.json(articles)
            
        }).catch((err)=>console.error(err))
})
    
app.listen(port, () => console.log(`Server running on port ${port}!`))



