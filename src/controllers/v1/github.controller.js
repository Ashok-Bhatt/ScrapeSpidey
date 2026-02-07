import { configBrowserPage } from "../../utils/scrapeConfig.js"
import handleError from "../../utils/errorHandler.js";

const getGithubBadges = async (req, res) => {
    const username = req.query.user;
    const url = `https://github.com//${username}?tab=achievements`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let page;

    try {
        page = await configBrowserPage(url, 'networkidle2', '.achievement-card', 30000, 30000);

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";

            const githubBadgesElement = Array.from(document.querySelectorAll(".achievement-card"));

            return githubBadgesElement.map((badgeElement) => {
                const iconElement = badgeElement.querySelector("img");
                const nameElement = badgeElement.querySelector(".ws-normal");
                const countElement = badgeElement.querySelector(".achievement-tier-label");

                const icon = iconElement ? iconElement.getAttribute("src") : "NA";
                const name = getText(nameElement);
                const count = getText(countElement);

                return {
                    icon: icon,
                    name: name,
                    count: count != "NA" ? parseInt(count.slice(1, count.length)) : 1
                }
            });
        });

        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    } finally {
        if (page) await page.close();
    }
}

export {
    getGithubBadges,
}