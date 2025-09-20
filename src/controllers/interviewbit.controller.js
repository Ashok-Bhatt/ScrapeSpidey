import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.interviewbit.com/profile/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser) return res.status(500).json({ error: "Failed to setup browser"});

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout : 10000 });
        await page.waitForSelector('.recharts-surface', { timeout: 10000 });

        const data = await page.evaluate((username) => {

            const getText = (element) => element?.textContent || "NA";
           
            const problemsSolvedElement = Array.from(document.querySelectorAll(".profile-daily-goal__goal-details"));
            const statsElement = Array.from(document.querySelectorAll(".profile-overview-stat-table__item-value"));
            const joinedOnElement = document.querySelector(".profile-overview-user-details__since");
            const easyProblemsElement = document.querySelectorAll(".profile-progress-card__stat--easy span")[1];
            const mediumProblemsElement = document.querySelectorAll(".profile-progress-card__stat--medium span")[1];
            const hardProblemsElement = document.querySelectorAll(".profile-progress-card__stat--hard span")[1];
            const totalProblemsElement = document.querySelectorAll(".profile-progress-card__stat--total span")[1];
            const correctAnswersElement = Array.from(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--correct_answer span"))[1];
            const compilationErrorElement = Array.from(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--compilation_error span"))[1];
            const wrongAnswersElement = Array.from(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--wrong_answer span"))[1];
            const othersElement = Array.from(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--others span"))[1];

            const badgesElement = Array.from(document.querySelectorAll(".profile-badge-progress-tile"));

            const totalScore = getText(problemsSolvedElement[0]);
            const totalCoins = getText(problemsSolvedElement[1]);
            const streak = getText(problemsSolvedElement[2]);
            const totalSolvedProblems = getText(problemsSolvedElement[3]);
            const globalRank = getText(statsElement[0]);
            const universityRank = getText(statsElement[1]);
            const timeSpent = getText(statsElement[2]);
            const joinedOn = getText(joinedOnElement);
            const easyProblems = getText(easyProblemsElement);
            const mediumProblems = getText(mediumProblemsElement);
            const hardProblems = getText(hardProblemsElement);
            const totalProblems = getText(totalProblemsElement);
            const correctAnswers = getText(correctAnswersElement);
            const compilationErrors = getText(compilationErrorElement);
            const wrongAnswers = getText(wrongAnswersElement);
            const others = getText(othersElement);
            
            const problemsSolved = {
                Easy : easyProblems != "NA" ? parseInt(easyProblems) : 0,
                Medium : mediumProblems != "NA" ? parseInt(mediumProblems) : 0,
                Hard : hardProblems != "NA" ? parseInt(hardProblems) : 0,
                Total : totalSolvedProblems != "NA" ? parseInt(totalSolvedProblems) : 0,
            }

            const badges = badgesElement.map((badge) => {
                return {
                    title : getText(badge.querySelector(".profile-badge-progress-tile__title")),
                    date : getText(badge.querySelector(".profile-badge-progress-tile__sub-title")),
                    image : badge.querySelector(".profile-badge-progress-tile__badge-img")?.getAttribute("style"),
                }
            })

            const submissionAnalysis = {
                correctAnswers : correctAnswers != "NA" ? parseInt(correctAnswers) : 0,
                wrongAnswers : wrongAnswers != "NA" ? parseInt(wrongAnswers) : 0,
                compilationErrors : compilationErrors != "NA" ? parseInt(compilationErrors) : 0,
                others : others != "NA" ? parseInt(others) : 0,
            }

            const interviewbitData = {
                username : username,
                totalScore: totalScore != "NA" ? parseInt(totalScore) : 0,
                totalCoins: totalCoins != "NA" ? parseInt(totalCoins) : 0,
                streak: streak != "NA" ? parseInt(streak) : 0,
                globalRank : globalRank != "NA" ? parseInt(globalRank) : null,
                universityRank : universityRank != "NA" ? parseInt(universityRank) : null,
                joinedOn : joinedOn,
                timeSpent : timeSpent,
                totalProblems : parseInt(totalProblems),
                problemsSolved : problemsSolved,
                badges: badges,
                submissionAnalysis : submissionAnalysis,
            }

            return interviewbitData;
        }, username);
        
        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

export {
    getUserInfo,
}