import { configChromeDriver, configBrowserPage } from "../../utils/scrapeConfig.js"
import { isLeapYear, getDateDetailsFromDayOfYear, scrapeGfgTooltipData } from "../../utils/calendar.js"
import handleError from "../../utils/errorHandler.js";
import axios from "axios";

const getUserInfo = async (req, res) => {
    const username = req.query.user;
    const profilePageUrl = `https://www.geeksforgeeks.org/user/${username}`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let browser;
    let page;

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ message: "Failed to setup browser" });

        // Going to Profile Tab
        page = await configBrowserPage(browser, profilePageUrl, 'domcontentloaded', '.NewProfile_container__licgi', 30000, 30000);

        const userProfileData = await page.evaluate((username) => {

            const getText = (element) => element?.textContent || "NA";

            const avatarElement = document.querySelector(".NewProfile_container__licgi img");
            const guestNameElement = document.querySelector(".NewProfile_name__N_Nlw");
            const userTaglineElement = document.querySelector(".NewProfile_designation__fujtZ");
            const followersCountElement = document.querySelector(".NewProfile_followData__D1eYY span");
            const followingsCountElement = document.querySelector(".NewProfile_followData__D1eYY span:nth-child(3)");
            const aboutMeElement = document.querySelector(".Overview_about-me-text__AMz1Q");
            const experienceInYearsElement = document.querySelector(".Overview_section-header__lhPM2 .Overview_subheading__kZ_3w");

            const avatar = avatarElement?.getAttribute("src") || "NA";

            const avatarUrl = avatar !== "NA" ? "https://www.geeksforgeeks.org/" + avatar : "NA";
            const guestName = getText(guestNameElement);
            const userTagline = getText(userTaglineElement);
            const followersCount = getText(followersCountElement);
            const followingsCount = getText(followingsCountElement);
            const aboutMe = getText(aboutMeElement);
            const experienceInYears = getText(experienceInYearsElement);

            const data = {
                username: username,
                avatar: avatarUrl,
                guestName: guestName,
                userTagline: userTagline,
                followersCount: followersCount == "NA" ? 0 : parseInt(followersCount),
                followingsCount: followingsCount == "NA" ? 0 : parseInt(followingsCount),
                aboutMe: aboutMe,
                experienceInYears: experienceInYears == "NA" ? 0 : parseInt(experienceInYears.split(" ")[2]),
            };

            return data;

        }, username);


        // Coding Score Tab
        page = await configBrowserPage(browser, `${profilePageUrl}?tab=activity`, 'networkidle0', '.ProblemNavbar_head_nav__OqbEt', 30000, 30000);

        const userCodingData = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";
            const getTitleCase = (word) => word.charAt(0).toUpperCase() + word.slice(1);

            const difficultyTags = ["School", "Basic", "Easy", "Medium", "Hard"];
            const problemsSolved = {};

            const statsElements = Array.from(document.querySelectorAll(".ScoreContainer_score-grid__zozAO .ScoreContainer_value__7yy7h"));
            const currentStreakElement = document.querySelector(".PotdContainer_streakText__oNgWh");
            const potdElements = Array.from(document.querySelectorAll(".PotdContainer_statValue__nt1dr"));
            const problemDifficultyTagElements = Array.from(document.querySelectorAll(".ProblemNavbar_head_nav--text__7u4wN"));

            const codingScore = getText(statsElements[0]);
            const totalProblemsSolved = getText(statsElements[1]);
            const instituteRank = getText(statsElements[2]);
            const articlesPublished = getText(statsElements[3]);
            const currentStreak = getText(currentStreakElement);
            const maxStreak = getText(potdElements[0]);
            const potdsSolved = getText(potdElements[1]);

            problemDifficultyTagElements.forEach((selector) => {
                const key = getTitleCase(selector.textContent.split(" ")[0].toLowerCase());
                let value = selector.textContent.split(" ")[1];
                value = value.slice(1, value.length - 1);
                problemsSolved[key] = parseInt(value);
            });

            // If User has not solved a single question, then it will initialize the number of questions to each difficulty level to 0
            for (let i = 0; i < difficultyTags.length; i++) {
                if (!problemsSolved[difficultyTags[i]]) {
                    problemsSolved[difficultyTags[i]] = 0
                }
            }

            const data = {
                codingScore: codingScore == "NA" ? 0 : parseInt(codingScore),
                instituteRank: instituteRank == "NA" ? -1 : parseInt(instituteRank),
                articlesPublished: (articlesPublished == "NA" || articlesPublished == "__") ? 0 : parseInt(articlesPublished),
                totalProblemsSolved: totalProblemsSolved == "NA" ? 0 : parseInt(totalProblemsSolved),
                currentStreak: currentStreak == "NA" ? 0 : parseInt(currentStreak.split(" ")[0]),
                maxStreak: maxStreak == "NA" ? 0 : parseInt(maxStreak.split(" ")[0]),
                potdsSolved: potdsSolved == "NA" ? 0 : parseInt(potdsSolved.split(" ")[0]),
                problemsSolved: problemsSolved,
            }

            return data;

        });

        return res.status(200).json({ ...userProfileData, ...userCodingData });
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    } finally {
        if (browser) await browser.close();
    }
};

const getUserSubmissions = async (req, res) => {
    const username = req.query.user;
    const year = req.query.year || new Date().getFullYear().toString();
    const yearInt = parseInt(year, 10);
    let heatmapData = {};

    const url = `https://www.geeksforgeeks.org/profile/${username}?tab=activity`;

    if (!username) return res.status(400).json({ message: "Username not found" });

    let browser;
    let page;

    const yearButtonSelector = ".HeatMapHeader_year_button___SZVP";
    const dropdownItemSelector = ".HeatMapHeader_dropdown_item__CnSGm";
    const heatmapSvgContainer = '.ch-domain-container-animation-wrapper';
    const tooltipSelector = '#ch-tooltip-body';

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ message: "Failed to setup browser" });

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.HeatAndLineChart_heatAndLineChart__5JbBm', 30000, 30000);

        await page.click(yearButtonSelector);
        await page.waitForSelector(dropdownItemSelector, { visible: true });

        const heatmapOptionValues = await page.$$eval(
            dropdownItemSelector,
            options => options.map(option => option.textContent.trim())
        );

        const yearIndex = heatmapOptionValues.indexOf(year);
        if (yearIndex === -1) return res.status(404).json({ message: `Year ${year} not found in dropdown options.` });

        const specificYearSelector = `div.HeatMapHeader_dropdown_item__CnSGm:nth-child(${yearIndex + 1})`;

        await page.click(specificYearSelector);
        await page.waitForSelector(heatmapSvgContainer, { visible: true });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const daysInYear = isLeapYear(yearInt) ? 366 : 365;

        for (let i = 0; i < daysInYear; i++) {
            const { dateKey, month, dayOfMonth } = getDateDetailsFromDayOfYear(yearInt, i);
            const dailyBlockSelector = `.m_${month} g:nth-child(${dayOfMonth}) rect`;
            const scrapedData = await scrapeGfgTooltipData(page, dailyBlockSelector, tooltipSelector);
            const finalDateKey = scrapedData.date || dateKey;
            heatmapData[finalDateKey] = scrapedData.count;
        }

        return res.status(200).json(heatmapData);

    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    } finally {
        if (browser) await browser.close();
    }
}

const getUserProblemsSolved = async (req, res) => {
    try {
        const username = req.query.user;
        if (!username) return res.status(400).json({ message: "Username not found" });

        const reponse = await axios.post("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", { handle: username, requestType: "", year: "", month: "" })
        const data = reponse.data;

        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
}

const getInstitutionTopThreeRankedUsers = async (req, res) => {

    const institution = req.query.institution;
    const url = `https://www.geeksforgeeks.org/colleges/${institution}/`;

    if (!institution) return res.status(400).json({ message: "Institution name not provided" });

    let browser;
    let page;

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ message: "Failed to setup browser" });

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.BreadCrumbs_head_singleItem__5u7Ke.BreadCrumbs_head_activeItem__ePY__', 30000, 30000);

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";

            const rows = Array.from(document.querySelectorAll('.UserCodingProfileCard_userCodingProfileCard__0GQCR'));

            return rows.map((row, rowIndex) => {
                const usernameElement = row.querySelector(".UserCodingProfileCard_userCodingProfileCard_dataDiv_data--linkhandle__lZchE");

                const userStatsElement = Array.from(row.querySelectorAll(".UserCodingProfileCard_userCodingProfileCard_dataDiv_data--value__3A8Kx"));

                const username = getText(usernameElement);
                const userProblemsSolved = getText(userStatsElement[0]);
                const userCodingScore = getText(userStatsElement[1]);
                const userPotdStreak = getText(userStatsElement[2]);

                return {
                    rank: rowIndex + 1,
                    username: username,
                    userProblemsSolved: userProblemsSolved != "NA" ? parseInt(userProblemsSolved) : "NA",
                    userCodingScore: userCodingScore != "NA" ? parseInt(userCodingScore) : "NA",
                    userPotdStreak: userPotdStreak != "NA" ? parseInt(userPotdStreak) : "NA",
                };
            });
        });

        return res.status(200).json({ institution, users: data });
    } catch (error) {
        return handleError(res, error, "Failed to fetch institution top 10 ranked users");
    } finally {
        if (browser) await browser.close();
    }
};

const getInstitutionInfo = async (req, res) => {

    const institution = req.query.institution;
    const url = `https://www.geeksforgeeks.org/colleges/${institution}/`;

    if (!institution) return res.status(400).json({ message: "Institution name not provided" });

    let browser;
    let page;

    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({ message: "Failed to setup browser" });

        page = await configBrowserPage(browser, url, 'networkidle2', '.ColgOrgIntroCard_tabHead_details_name__zYvs8', 30000, 30000);

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";

            const institutionNameElement = document.querySelector(".ColgOrgIntroCard_tabHead_details_name__zYvs8");
            const institutionLocationElement = document.querySelector(".ColgOrgIntroCard_tabHead_details_info_location--value__rc1Dq");
            const institutionUrlElement = document.querySelector(".ColgOrgIntroCard_tabHead_details_info_email--link__ppVAZ")
            const institutionRegisteredUsersCountElement = document.querySelector(".ColgOrgIntroCard_tabHead_details_user_regs--numberCursor__uoM0s");

            const institutionName = getText(institutionNameElement);
            const institutionLocation = getText(institutionLocationElement);
            const institutionUrl = getText(institutionUrlElement);
            const institutionRegisteredUsersCount = getText(institutionRegisteredUsersCountElement);

            const institutionData = {
                institutionName: institutionName,
                institutionLocation: institutionLocation,
                institutionUrl: institutionUrl,
                institutionRegisteredUsersCount: institutionRegisteredUsersCount != "NA" ? parseInt(institutionRegisteredUsersCount) : "NA",
            }

            return institutionData;
        });

        return res.status(200).json({ institution, data: data });
    } catch (error) {
        return handleError(res, error, "Failed to fetch institution info");
    } finally {
        if (browser) await browser.close();
    }
};


export {
    getUserInfo,
    getUserSubmissions,
    getInstitutionTopThreeRankedUsers,
    getInstitutionInfo,
    getUserProblemsSolved,
}