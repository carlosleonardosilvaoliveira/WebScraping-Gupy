const puppeteer         = require("puppeteer-extra");
const randomUseragent   = require('random-useragent');
const StealthPlugin     = require("puppeteer-extra-plugin-stealth");

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
puppeteer.use(StealthPlugin());

const {executablePath}  = require('puppeteer');

const {pegarDados, modifyEmpresa} = require("./scrapingData");
const {response} = require("express");

exports.scrap = async (req, res) => {
    const empresa   = req.body.website;

    if(typeof empresa === 'undefined') return res.status(401).json({ error: "Input vazio!" });

    try {
        await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--lang=pt-BR, pt',
            ],

            headless: false,
            ignoreHTTPSErrors: true,

            executablePath: executablePath(),
        }).then(async browser => {
            console.log('Rodando Scraper');
            const userAgent = randomUseragent.getRandom();
            const UA = userAgent || USER_AGENT;
            const [page] = await browser.pages();
            /*await page.setViewport({
                width: 1920 + Math.floor(Math.random() * 100),
                height: 3000 + Math.floor(Math.random() * 100),
                deviceScaleFactor: 1,
                hasTouch: false,
                isLandscape: false,
                isMobile: false,
            });*/
            await page.setUserAgent(UA);
            await page.setJavaScriptEnabled(true);
            await page.setDefaultNavigationTimeout(0);

            await page.setExtraHTTPHeaders({
                'Accept-Language': 'pt'
            });
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, "language", {
                    get: function () {
                        return "pt-BR";
                    }
                });
                Object.defineProperty(navigator, "languages", {
                    get: function () {
                        return ["pt-BR", "pt"];
                    }
                });
            });

            /*const site = await page.goto(modifyEmpresa(empresa), {
                waitUntil: 'networkidle0',
            });*/

            const site = await page.goto(empresa, {
                waitUntil: 'networkidle0',
            });

            //await page.click('div.has-reject-all-button > div > button#onetrust-accept-btn-handler');

            if(site.status() === 404){
                console.log('Site não encontrado!');
                await browser.close();
            }else{
                await page.waitForSelector('section#job-listing');
                await pegarDados(page);
                await browser.close();
            }

        })

    } catch (error) {
        console.log('error', error);
    }
}
