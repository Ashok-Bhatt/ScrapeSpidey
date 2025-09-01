import {APIError} from "../utils/APIError.js"
import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.hackerrank.com/profile/${username}/`;

    if (!username){
        return new APIError(400, "Username not found");
    }

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser){
            res.status(500).json({ error: "Failed to setup browser"});
        }

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout : 2*60*1000 });
        await page.waitForSelector('.hr-heading-02.profile-title.ellipsis', { timeout: 5000 });

        const data = await page.evaluate((username) => {

            const HACKERRANK_DOMAIN = "https://www.hackerrank.com"

            const getText = (element) => element?.textContent || "NA";

            const profileImageElement = document.querySelector(".hex-profile-avatar img");
            const badgesElement = Array.from(document.querySelectorAll(".badges-list .hacker-badge"));
            const certificateElement = Array.from(document.querySelectorAll(".hacker-certificates .hacker-certificate"));

            const badges = badgesElement.map((badge)=>{
                return {
                    image : badge.querySelector(".badge-icon")?.getAttribute("xlink:href"),
                    title : getText(badge.querySelector(".badge-title")),
                    stars: Array.from(badge.querySelectorAll(".star-section>svg>svg")).length,
                }
            })

            const certificates = certificateElement.map((certificate)=>{
                return {
                    link : certificate ? HACKERRANK_DOMAIN + certificate.getAttribute("href") : "",
                    title : getText(certificate.querySelector(".certificate_v3-heading")).replace("Certificate: ", ""),
                }
            })

            const hackerrankData = {
                username : username,
                profileImage: profileImageElement.getAttribute("src"),
                badges: badges,
                certificates : certificates,
            };

            return hackerrankData;
        }, username);

        res.json(data);
        browser.close();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

export {
    getUserInfo,
}