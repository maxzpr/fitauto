const { chromium } = require('playwright');

const run = async (url = '', requestIntercepts = [], responseIntercepts = [],) => {
    return new Promise(async (resolve, reject) => {
        var responseMap = [];

        try {
            const browser = await chromium.launch({
                args: ['--no-sandbox']
            });

            const page = await browser.newPage();

            page.on('request', async request => {
                let url = request.url();
                for (let req of requestIntercepts) {
                    if (req.urlFilter(url)) {
                        request.respond({
                            content: 'application/json',
                            headers: { "Access-Control-Allow-Origin": "*" },
                            body: JSON.stringify(req.buildbody(request.postDataJSON()))
                        });
                    }
                    else {
                        request.continue();
                    }
                }
            })

            page.on('response', async response => {
                let url = response.url();
                for (let res of responseIntercepts) {
                    if (res.urlFilter(url)) {
                        let data = await response.json();
                        let results = res.mapResponse(data);
                        responseMap.push({ name: res?.name ?? 'undefined', results });
                    }
                }
            })

            await page.goto(url, { waitUntil: "networkidle" });

            resolve(responseMap);

            await page.close();
        } catch (e) {
            return resolve({ error: e });
        }
    })
}

module.exports = run;