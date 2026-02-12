import { configBrowserPage } from "../../utils/scrapper.util.js"
import { getDateDetailsFromDayOfYear, scrapeGfgTooltipData } from "../../utils/calendar.util.js";
import { asyncHandler } from "../../utils/async-handler.util.js";

const getUserInfo = asyncHandler(async (req, res) => {
    const username = req.query.user;
    const includeSubmissionStats = req.query.includeSubmissionStats === "true";
    const includeBadges = req.query.includeBadges === "true";
    const url = `https://www.interviewbit.com/profile/${username}/`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let page;

    try {
        page = await configBrowserPage(url, 'domcontentloaded', '.recharts-surface', 30000, 30000);

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

    } finally {
        if (page) await page.close();
    }
});

const getUserSubmissions = asyncHandler(async (req, res) => {
    const username = req.query.user;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    let heatmapData = {};

    const url = `https://www.interviewbit.com/profile/${username}`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let page;

    const yearButtonSelector = ".profile-activity-heatmap__year-select-selected";
    const dropdownItemSelector = ".profile-activity-heatmap__year-select-item";
    const heatmapSvgContainer = '.profile-activity-heatmap__months';
    const tooltipSelector = '.profile-activity-heatmap__tooltip';

    try {
        page = await configBrowserPage(url, 'domcontentloaded', '.profile-activity-heatmap__months', 30000, 30000);

        await page.click(yearButtonSelector);
        await new Promise(resolve => setTimeout(resolve, 250));
        await page.waitForSelector(dropdownItemSelector, { visible: true });

        const heatmapOptionValues = await page.$$eval(
            dropdownItemSelector,
            options => options.map(option => option.textContent.trim())
        );

        const yearIndex = heatmapOptionValues.indexOf(year.toString());
        if (yearIndex === -1) return res.status(404).json({ message: `Year ${year} not found in dropdown options.` });

        const specificYearSelector = `.profile-activity-heatmap__year-select-item:nth-child(${yearIndex + 1})`;

        await page.click(specificYearSelector);
        await page.waitForSelector(heatmapSvgContainer, { visible: true });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const dailyBlocksCount = await page.evaluate(() => {
            return document.querySelectorAll(".profile-activity-heatmap__day:not(.profile-activity-heatmap__day--disabled)").length;
        })

        for (let i = 0; i < dailyBlocksCount; i++) {
            const { dateKey, month, dayOfMonth } = getDateDetailsFromDayOfYear(year, i);
            const dailyBlockSelector = `.profile-activity-heatmap__day:not(.profile-activity-heatmap__day--disabled):nth-child(${i + 1})`;
            const scrapedData = await scrapeGfgTooltipData(page, dailyBlockSelector, tooltipSelector);
            const finalDateKey = scrapedData.date || dateKey;
            heatmapData[finalDateKey] = scrapedData.count;
        }

        return res.status(200).json(heatmapData);

    } finally {
        if (page) await page.close();
    }
});

const getUserBadges = asyncHandler(async (req, res) => {
    const username = req.query.user;
    const url = `https://www.interviewbit.com/profile/${username}/`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let page;

    try {
        page = await configBrowserPage(url, 'domcontentloaded', '.recharts-surface', 30000, 30000);

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";

            const badges = Array.from(document.querySelectorAll(".profile-badge-progress-tile")).map((badge) => ({
                title: getText(badge.querySelector(".profile-badge-progress-tile__title")),
                date: getText(badge.querySelector(".profile-badge-progress-tile__sub-title")),
                image: badge.querySelector(".profile-badge-progress-tile__badge-img")?.getAttribute("style"),
            }));

            return badges;
        });

        return res.status(200).json(data);

    } finally {
        if (page) await page.close();
    }
});

export {
    getUserInfo,
    getUserSubmissions,
    getUserBadges,
}
