import {configChromeDriver} from "../utils/scrapeConfig.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.hackerrank.com/profile/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ error: "Failed to setup browser"});

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.hr-heading-02.profile-title.ellipsis', 30000, 30000);

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

        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

export {
    getUserInfo,
}