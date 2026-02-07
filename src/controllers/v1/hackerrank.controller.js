import { configBrowserPage } from "../../utils/scrapper.util.js";
import { asyncHandler } from "../../utils/async-handler.util.js";

const getUserInfo = asyncHandler(async (req, res) => {
    const username = req.query.user;
    const url = `https://www.hackerrank.com/profile/${username}/`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let page;

    try {
        page = await configBrowserPage(url, 'domcontentloaded', '.hr-heading-02.profile-title.ellipsis', 30000, 30000);

        const data = await page.evaluate((username) => {

            const HACKERRANK_DOMAIN = "https://www.hackerrank.com"

            const getText = (element) => element?.textContent || "NA";

            const profileImageElement = document.querySelector(".hex-profile-avatar img");
            const badgesElement = Array.from(document.querySelectorAll(".badges-list .hacker-badge"));
            const certificateElement = Array.from(document.querySelectorAll(".hacker-certificates .hacker-certificate"));

            const badges = badgesElement.map((badge) => {
                return {
                    image: badge.querySelector(".badge-icon")?.getAttribute("xlink:href"),
                    title: getText(badge.querySelector(".badge-title")),
                    stars: Array.from(badge.querySelectorAll(".star-section>svg>svg")).length,
                }
            })

            const certificates = certificateElement.map((certificate) => {
                return {
                    link: certificate ? HACKERRANK_DOMAIN + certificate.getAttribute("href") : "",
                    title: getText(certificate.querySelector(".certificate_v3-heading")).replace("Certificate: ", ""),
                }
            })

            const hackerrankData = {
                username: username,
                profileImage: profileImageElement.getAttribute("src"),
                badges: badges,
                certificates: certificates,
            };

            return hackerrankData;
        }, username);

        return res.status(200).json(data);

    } finally {
        if (page) await page.close();
    }
});

export {
    getUserInfo,
}
