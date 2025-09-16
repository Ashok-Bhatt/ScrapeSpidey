import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const includeContests = req.query.includeContests || false;
    const url = `https://www.codechef.com/users/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser) return res.status(500).json({ error: "Failed to setup browser"});

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout : 2*60*1000 });
        await page.waitForSelector('.user-details-container.plr10', { timeout: 5000 });

        const data = await page.evaluate((username, includeContests) => {

            const getText = (element) => element?.textContent || "NA";

            const problemsSolvedElement = Array.from(document.querySelectorAll(".rating-data-section.problems-solved h3"));
            const profileImageElement = document.querySelector(".profileImage");
            const leagueBadgeElement = document.querySelector(".user-league-container > img");
            const achievementsElement = Array.from(document.querySelectorAll(".widget.badges"));

            const skillTestElement = achievementsElement.length == 2 ? Array.from(achievementsElement[0].querySelectorAll(".skill-tests__block")) : null;
            const badgesElement = achievementsElement.length == 2 ? Array.from(achievementsElement[1].querySelectorAll(".badge")) : Array.from(achievementsElement[0].querySelectorAll(".badge"));

            // Skill Tests
            const skillTests = skillTestElement ? skillTestElement.map((skillTestElement)=>{

                const percentageScore = getText(skillTestElement.querySelector(".score__percentage"));

                return {
                    percentageScore : parseInt(percentageScore.slice(0, percentageScore.length-1)),
                    title : getText(skillTestElement.querySelector(".skill-tests__title")),
                    link : "https://www.codechef.com/" + skillTestElement.querySelector("a").getAttribute("href"),
                    attemptDate : getText(skillTestElement.querySelector(".skill-tests__description")).split(" ").splice(2,2).join(" "),
                };
            }) : [];

            // // Badges
            const badges = badgesElement.map((badge) => {
                return {
                    badgeImage : badge.querySelector("img").getAttribute("src"),
                    badgeTitle : getText(badge.querySelector(".badge__title")).split("-")[0]?.trim(),
                    badgeLevel : getText(badge.querySelector(".badge__title")).split("-")[1]?.trim(),
                    badgeDescription: getText(badge.querySelector(".badge__description")),
                }
            });

            const problemsSolved = problemsSolvedElement ? getText(problemsSolvedElement.at(-1)).split(" ").at(-1) : "NA";
            const profileImage = profileImageElement?.getAttribute("src") || "NA";

            const codechefData = {
                username : username,
                problemsSolved : problemsSolved == "NA" ? "NA" : parseInt(problemsSolved),
                profileImage : profileImage,
                leagueBadgeElement : leagueBadgeElement?.getAttribute("src"),
                skillTests : skillTests,
                badges : badges,
            }

            if (includeContests){
                const currentRatingElement = document.querySelector(".rating-number");
                const highestRatingElement = document.querySelector(".rating-header>small");
                const contestDivElement = Array.from(document.querySelectorAll(".rating-header>div"));
                const contestStarsElement = Array.from(document.querySelectorAll(".rating-star span"));
                const RankElements = document.querySelectorAll(".rating-ranks li a");

                const currentRating = getText(currentRatingElement);
                const highestRating = getText(highestRatingElement);

                const contestData = {
                    currentRating : currentRating == "NA" ? "NA" : parseInt(currentRating),
                    highestRating : highestRating == "NA" ? "NA" : parseInt(getText(highestRatingElement).split(" ").at(-1).slice(0, -1)),
                    contestDiv : contestDivElement.length>=1 ? parseInt(getText(contestDivElement[1]).at(-2)) : "NA",
                    contestStars : contestStarsElement.length,
                    globalRank : RankElements.length ? parseInt(getText(RankElements[0])) : "NA",
                    countryRank : RankElements.length > 1 ? parseInt(getText(RankElements[1])) : "NA",
                }

                codechefData.contestData = contestData;
            }

            return codechefData;
        }, username, includeContests);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

const getUserSubmissions = async (req, res) => {

    const username = req.params.user;
    const url = `https://www.codechef.com/users/${username}/`;

    if (!username){
        return res.status(400).json({message : "Username not found"});
    }

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser){
            return res.status(500).json({ error: "Failed to setup browser"});
        }

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout : 2*60*1000 });
        await page.waitForSelector('.user-details-container.plr10', { timeout: 5000 });

        const data = await page.evaluate(() => {

            const heatmapElement = Array.from(document.querySelectorAll(".heatmap-content svg rect"));
            const heatmapData = {};

            heatmapElement.map((heatmapBlock)=>{
                const date = heatmapBlock.getAttribute("data-date");
                const submissionsCount = heatmapBlock.getAttribute("data-count");
                heatmapData[date] = (submissionsCount ? parseInt(submissionsCount) : 0);
            })

            return heatmapData;
        });

        return res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
}

export {
    getUserInfo,
    getUserSubmissions,
}