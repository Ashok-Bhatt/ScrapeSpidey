import {configChromeDriver, configBrowserPage} from "../utils/scrapeConfig.js"

const getGithubBadges = async (req, res) => {
    const username = req.params.user;
    const url = `https://github.com//${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ error: "Failed to setup browser"});

        page = await configBrowserPage(browser, url, 'networkidle2', '.js-profile-editable-replace', 30000, 30000);

        const data = await page.evaluate(() => {
            const githubBadgesContainerElement = document.querySelector(".js-profile-editable-replace div.color-border-muted");
            const githubBadgesElement = Array.from(githubBadgesContainerElement.querySelectorAll("img"));
            return githubBadgesElement.map((badgeElement)=>badgeElement.getAttribute("src"));
        });

        return res.status(200).json(data);
    } catch (error){
        console.log(error.message);
        console.log(error.stack);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
}

export {
    getGithubBadges,
}