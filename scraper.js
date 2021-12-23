const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const run = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await chromium.launch({
                args: ['--no-sandbox']
            })

            const page = await browser.newPage()

            let results = { shoppening_list: [] };

            page.on('response', async response => {
                let url = response.url();
                if (url.includes("https://api.pttfitauto.com/applayout/list")) {
                    let data = await response.json();
                    results = (data?.results ?? {})?.shoppening_list ?? [];

                    fs.writeFileSync(path.join(__dirname, "./views/data.json"), JSON.stringify(results, null, 2));

                    resolve(results);
                }
            })

            await page.goto('https://www.pttfitauto.com/th/branch');

            await page.close();
        } catch (e) {
            return resolve({ error: e });
        }
    })
}

run()

module.exports = run;