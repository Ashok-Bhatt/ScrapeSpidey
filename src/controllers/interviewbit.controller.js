import {configChromeDriver, configBrowserPage} from "../utils/scrapeConfig.js"

const getUserInfo = async (req, res) => {
    const username = req.query.user;
    const includeSubmissionStats = req.query.includeSubmissionStats === "true";
    const includeBadges = req.query.includeBadges === "true";
    const url = `https://www.interviewbit.com/profile/${username}/`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let browser;
    let page;

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ message: "Failed to setup browser" });

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.recharts-surface', 30000, 30000);

        const data = await page.evaluate((username, includeSubmissionStats, includeBadges) => {

            const getText = (element) => element?.textContent || "NA";

            const problemsSolvedElement = Array.from(document.querySelectorAll(".profile-daily-goal__goal-details"));
            const statsElement = Array.from(document.querySelectorAll(".profile-overview-stat-table__item-value"));

            const easyProblems = getText(document.querySelectorAll(".profile-progress-card__stat--easy span")[1]);
            const mediumProblems = getText(document.querySelectorAll(".profile-progress-card__stat--medium span")[1]);
            const hardProblems = getText(document.querySelectorAll(".profile-progress-card__stat--hard span")[1]);
            const totalSolvedProblems = getText(problemsSolvedElement[3]);
            const joinedOn = getText(document.querySelector(".profile-overview-user-details__since"));

            const problemsSolved = {
                Easy: easyProblems !== "NA" ? parseInt(easyProblems) : 0,
                Medium: mediumProblems !== "NA" ? parseInt(mediumProblems) : 0,
                Hard: hardProblems !== "NA" ? parseInt(hardProblems) : 0,
                Total: totalSolvedProblems !== "NA" ? parseInt(totalSolvedProblems) : 0,
            };

            const interviewbitData = {
                username: username,
                totalScore: parseInt(getText(problemsSolvedElement[0])) || 0,
                totalCoins: parseInt(getText(problemsSolvedElement[1])) || 0,
                streak: parseInt(getText(problemsSolvedElement[2])) || 0,
                globalRank: parseInt(getText(statsElement[0])) || null,
                universityRank: parseInt(getText(statsElement[1])) || null,
                joinedOn: joinedOn,
                timeSpent: getText(statsElement[2]),
                totalProblems: parseInt(getText(document.querySelectorAll(".profile-progress-card__stat--total span")[1])) || 0,
                problemsSolved: problemsSolved,
            };

            // ✅ Include Badges Only If Requested
            if (includeBadges) {
                const badges = Array.from(document.querySelectorAll(".profile-badge-progress-tile")).map((badge) => ({
                    title: getText(badge.querySelector(".profile-badge-progress-tile__title")),
                    date: getText(badge.querySelector(".profile-badge-progress-tile__sub-title")),
                    image: badge.querySelector(".profile-badge-progress-tile__badge-img")?.getAttribute("style"),
                }));
                interviewbitData.badges = badges;
            }

            // ✅ Include Submission Stats Only If Requested
            if (includeSubmissionStats) {
                const correctAnswers = getText(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--correct_answer span")[1]);
                const wrongAnswers = getText(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--wrong_answer span")[1]);
                const compilationErrors = getText(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--compilation_error span")[1]);
                const others = getText(document.querySelectorAll(".profile-progress-card__stat.profile-progress-card__stat--others span")[1]);

                interviewbitData.submissionAnalysis = {
                    correctAnswers: correctAnswers !== "NA" ? parseInt(correctAnswers) : 0,
                    wrongAnswers: wrongAnswers !== "NA" ? parseInt(wrongAnswers) : 0,
                    compilationErrors: compilationErrors !== "NA" ? parseInt(compilationErrors) : 0,
                    others: others !== "NA" ? parseInt(others) : 0,
                };
            }

            return interviewbitData;
        }, username, includeSubmissionStats, includeBadges);

        return res.status(200).json(data);

    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return res.status(500).json({ message: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

export {
    getUserInfo,
}