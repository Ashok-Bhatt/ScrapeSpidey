import {APIError} from "../utils/APIError.js"
import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.codechef.com/users/${username}/`;

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
        await page.waitForSelector('.user-details-container.plr10', { timeout: 5000 });

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";

            const userNameElement = document.querySelector(".m-username--link");
            const problemsSolvedElement = Array.from(document.querySelectorAll(".rating-data-section.problems-solved h3"));
            const profileImageElement = document.querySelector(".profileImage");
            const currentRatingElement = document.querySelector(".rating-number");
            const contestDivElement = Array.from(document.querySelectorAll(".rating-header>div"))[1];
            const contestStarsElement = Array.from(document.querySelectorAll(".rating-star span"));
            const highestRatingElement = document.querySelector(".rating-header>small");
            const badgesElement = Array.from(document.querySelectorAll(".widget.badges"));

            // Skill Tests
            const skillTests = Array.from(badgesElement[0].querySelectorAll(".skill-tests__block")).map((skillTestElement)=>{
                return {
                    percentageScore : getText(skillTestElement.querySelector(".score__percentage")),
                    title : getText(skillTestElement.querySelector(".skill-tests__title")),
                    link : "https://www.codechef.com/" + skillTestElement.querySelector("a").getAttribute("href"),
                    attemptDate : getText(skillTestElement.querySelector(".skill-tests__description")).split(" ").splice(2,2).join(" "),
                }
            });

            // Badges
            const badges = Array.from(badgesElement[1].querySelectorAll(".badge")).map((badge) => {
                return {
                    badgeImage : badge.querySelector("img").getAttribute("src"),
                    badgeTitle : getText(badge.querySelector(".badge__title")).split("-")[0].trim(),
                    badgeLevel : getText(badge.querySelector(".badge__title")).split("-")[1].trim(),
                    badgeDescription: getText(badge.querySelector(".badge__description")),
                }
            })


            const codechefData = {
                username : getText(userNameElement),
                problemsSolved : parseInt(getText(problemsSolvedElement.at(-1)).split(" ").at(-1)),
                profileImage : profileImageElement.getAttribute("src"),
                currentRating : parseInt(getText(currentRatingElement)),
                contestDiv : parseInt(getText(contestDivElement).at(-2)),
                contestStars : contestStarsElement.length,
                highestRating : parseInt(getText(highestRatingElement).split(" ").at(-1).slice(0, -1)),
                skillTests : skillTests,
                badges : badges,
            }

            return codechefData;
        });
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