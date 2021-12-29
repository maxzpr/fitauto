const express = require("express");
const path = require("path");
const fs = require("fs");
const scraper = require('./scraper');
const models = require('./models')

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/fetchModel/:model", async (req, res) => {
    let { model } = req.params;
    let pathFile = (path.join(__dirname, `./models/${model.trim()}.js`));

    if (!fs.existsSync(pathFile)) {
        res.send('model not found')
    } else {
        let modelSelect = models[model];
        let scrapRes = await scraper(modelSelect.mainUrl, modelSelect.requestIntercepts, modelSelect.responseIntercepts);
        if (scrapRes) {
            for (let res of scrapRes) {
                let savePath = path.join(__dirname, `./response/${modelSelect.name}`);
                if(!fs.existsSync(savePath)){
                    fs.mkdirSync(savePath);
                }
                fs.writeFileSync(`${savePath}/${res.name}.json`, JSON.stringify(res, null, 2));
            }
        }
        res.json(scrapRes);
    }
})

app.get("/getByModel/:model", async (req, res) => {
    let { model } = req.params;
    let pathFile = path.join(__dirname, `./models/${model.trim()}.js`);

    if (!fs.existsSync(pathFile)) {
        res.send('model not found')
    } else {
        res.json(pathFile)
    }
})

app.listen(port, () => {
    console.log('server is running port:', port)
})