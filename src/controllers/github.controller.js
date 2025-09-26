import {configChromeDriver} from "../utils/chromeDriver.js"

const getGithubBadges = async (req, res) => {
    const username = req.params.user;
    const url = `https://github.com//${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;

    try {
        browser = await configChromeDriver();

        if (!browser) return res.status(500).json({ error: "Failed to setup browser"});

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Chromium";v="120", "Not=A?Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        });
        await page.goto(url, { waitUntil: 'networkidle2', timeout : 30000 });
        await page.waitForSelector('.js-profile-editable-replace', { timeout: 30000 });

        const data = await page.evaluate(() => {
            const githubBadgesContainerElement = document.querySelector(".js-profile-editable-replace div.color-border-muted");
            const githubBadgesElement = Array.from(githubBadgesContainerElement.querySelectorAll("img"));
            return githubBadgesElement.map((badgeElement)=>badgeElement.getAttribute("src"));
        });

        return res.status(200).json(data);
    } catch (error){
        console.log(error);
        console.log(error.stack);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
}

export {
    getGithubBadges,
}