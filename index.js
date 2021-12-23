const express = require("express");
const path = require("path");
const scraper = require('./scraper');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/",express.static(path.join(__dirname,"./views")))

app.listen(port, () => {
    console.log('server is running port:', port)
})

scraper();

setInterval(() => {
    scraper()
}, 60_000)