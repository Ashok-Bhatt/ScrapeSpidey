import {configChromeDriver, configBrowserPage} from "../utils/scrapeConfig.js"

const getUserInfo = async (req, res) => {
    const username = req.query.user;
    const includeContests = req.query.includeContests==="true";
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;
    
    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({message: "Failed to setup browser" });

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.educationDetails_head_left--text__tgi9I', 30000, 30000);

        const data = await page.evaluate((username, includeContests) => {

            const getText = (element) => element?.textContent || "NA";
            const getTitleCase = (word) => word.charAt(0).toUpperCase() + word.slice(1);

            const difficultyTags = ["School", "Basic", "Easy", "Medium", "Hard"];

            const avatarElement = document.querySelector(".profilePicSection_head_img__1GLm0 > span > img");
            const institutionNameElement = document.querySelector(".educationDetails_head_left--text__tgi9I");
            const institutionRankElement = document.querySelector(".educationDetails_head_left_userRankContainer--text__wt81s b");
            const languagesUsedElement = document.querySelector(".educationDetails_head_right--text__lLOHI");
            const maxStreakElement = document.querySelector(".circularProgressBar_head_mid_streakCnt__MFOF1");
            const codingScoreElement = document.querySelectorAll(".scoreCard_head_left--score__oSi_x")[0];
            const totalProblemsSolvedElement = document.querySelectorAll(".scoreCard_head_left--score__oSi_x")[1];

            const avatar = avatarElement?.getAttribute("src") || "NA";
            const institutionName = getText(institutionNameElement);
            const institutionRank = getText(institutionRankElement);
            const languagesUsed = getText(languagesUsedElement);
            const maxStreak = getText(maxStreakElement);
            let codingScore = getText(codingScoreElement);
            const totalProblemsSolved = getText(totalProblemsSolvedElement);

            if (codingScore == "__" || codingScore == "NA") codingScore = "0";
            const avatarUrl = avatar !== "NA" ? "https://www.geeksforgeeks.org/" + avatar : "NA";
            const problemsSolved = {
                Total: (totalProblemsSolved === "__" || totalProblemsSolved === "NA") ? 0 : parseInt(totalProblemsSolved),
            };

            // Extracting problems count for different difficulty level
            document.querySelectorAll(".problemNavbar_head_nav--text__UaGCx").forEach((selector) => {
                const key = getTitleCase(selector.textContent.split(" ")[0].toLowerCase());
                let value = selector.textContent.split(" ")[1];
                value = value.slice(1, value.length - 1);
                problemsSolved[key] = parseInt(value);
            });

            // If User has not solved a single question, then it will initialize the number of questions to each difficulty level to 0
            for (let i=0; i<difficultyTags.length; i++){
                if (!problemsSolved[difficultyTags[i]]){
                    problemsSolved[difficultyTags[i]] = 0
                }
            }

            const gfgData = {
                username : username,
                avatar: avatarUrl,
                institutionName : institutionName,
                institutionRank : institutionRank=="NA" ? "NA" : parseInt(institutionRank.split(" ")[0]),
                languagesUsed : languagesUsed=="NA" ? [] : languagesUsed.split(",").map((language)=>language.trim()),
                userMaxStreak : maxStreak=="NA" ? 0 : parseInt(maxStreak.split("/")[0]),
                globalMaxStreak : maxStreak=="NA" ? 0 : parseInt(maxStreak.split("/")[1]),
                codingScore : codingScore=="NA" ? 0 : parseInt(codingScore),
                problemsSolved : problemsSolved,
            };

            if (includeContests===true){

                const contestRatingElement = document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[0];
                const contestLevelElement = document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[1];
                const contestRankingElement = document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[2];
                const contestAttendedElement = document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[3];
                const contestTopPercentageElement =  document.querySelector(".contestDetailsCard_head__0MvGa > p");
                const contestTotalParticipantsElement = document.querySelector(".contestDetailsCard_head__0MvGa > p");
                const contestsDataElement = Array.from(document.querySelectorAll(".contestToolTip .innerContent .contestToolTipContent "))

                const contestRating = getText(contestRatingElement);
                const contestLevel = getText(contestLevelElement);
                const contestRanking = getText(contestRankingElement);
                const contestAttended = getText(contestAttendedElement);
                let contestTopPercentage = getText(contestTopPercentageElement);
                const contestTotalParticipants = getText(contestTotalParticipantsElement);
                const contests = [];

                for (let i=0; i<contestsDataElement.length; i++){
                    const ratingElement = contestsDataElement[i].querySelector("span");
                    const rankElement = contestsDataElement[i].querySelector("p");
                    const contestNameElement = contestsDataElement[i].querySelector("a");

                    contests.push({
                        name: contestNameElement.textContent.split(" [")[0],
                        rank: parseInt(rankElement.split("-")[1]),
                        rating: parseInt(ratingElement.textContent.split(" ")[0]),
                        ratingChange: ratingElement.textContent.split(" ")[1].slice(1, -1)
                    })
                }

                if (contestTopPercentage !== "NA") contestTopPercentage = contestTopPercentage.split(" ")[3].slice(0, contestTopPercentage.length - 1);

                // Extracting the contest data
                const contestData = {
                    contestRating : contestRating=="NA" ? 1500 : parseInt(contestRating),
                    contestLevel : contestLevel=="NA" ? 0 : parseInt(contestLevel),
                    contestRanking : contestRanking=="NA" ? "NA" : parseInt(contestRanking),
                    contestAttended : contestAttended=="NA" ? 0 : parseInt(contestAttended),
                    contestTopPercentage: contestTopPercentage=="NA" ? "NA" : parseInt(contestTopPercentage),
                    contestTotalParticipants: contestTotalParticipants=="NA" ? "NA" : parseInt(contestTotalParticipants.split(" ")[5]),
                    contests: contests,
                }

                gfgData.contestData = contestData;
            }

            return gfgData;
            
        }, username, includeContests);
        
        return res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return res.status(500).json({message: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

const getUserSubmissions = async (req, res) => {
    const username = req.query.user;
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;
    
    try {
        browser = await configChromeDriver();
        if (!browser) return res.status(500).json({message: "Failed to setup browser"});

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.heatMapCard_head__QlR7_', 30000, 30000);
    
        const data = await page.evaluate(() => {
            return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)["props"]["pageProps"]["heatMapData"]["result"];
        });

        return res.status(200).json(data);
    } catch (error) {
           console.log(error.message);
           console.log(error.stack);
           return res.status(500).json({message: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
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
                    userProblemsSolved : userProblemsSolved!="NA" ? parseInt(userProblemsSolved) : "NA",
                    userCodingScore : userCodingScore!="NA" ? parseInt(userCodingScore) : "NA",
                    userPotdStreak : userPotdStreak!="NA" ? parseInt(userPotdStreak) : "NA",
                };
            });
        });

        return res.status(200).json({ institution, users: data });
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return res.status(500).json({ message: "Failed to fetch institution top 10 ranked users"});
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

        page = await configBrowserPage(browser, url, 'domcontentloaded', '.ColgOrgIntroCard_tabHead_details_name__zYvs8', 30000, 30000);

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
                institutionName : institutionName,
                institutionLocation : institutionLocation,
                institutionUrl : institutionUrl,
                institutionRegisteredUsersCount : institutionRegisteredUsersCount!="NA" ? parseInt(institutionRegisteredUsersCount) : "NA",
            }

            return institutionData;
        });

        return res.status(200).json({ institution, data: data });
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return res.status(500).json({ message: "Failed to fetch institution info"});
    } finally {
        if (browser) await browser.close();
    }
};


export {
    getUserInfo,
    getUserSubmissions,
    getInstitutionTopThreeRankedUsers,
    getInstitutionInfo
}