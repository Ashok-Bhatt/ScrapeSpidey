import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const includeContests = req.query.includeContests==="true";
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser) return res.status(500).json({ error: "Failed to setup browser" });

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForSelector('.educationDetails_head_left--text__tgi9I', { timeout: 10000 });

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

                const contestRating = getText(contestRatingElement);
                const contestLevel = getText(contestLevelElement);
                const contestRanking = getText(contestRankingElement);
                const contestAttended = getText(contestAttendedElement);
                let contestTopPercentage = getText(contestTopPercentageElement);
                const contestTotalParticipants = getText(contestTotalParticipantsElement);

                if (contestTopPercentage !== "NA") contestTopPercentage = contestTopPercentage.split(" ")[3].slice(0, contestTopPercentage.length - 1);

                // Extracting the contest data
                const contestData = {
                    contestRating : contestRating=="NA" ? 1500 : parseInt(contestRating),
                    contestLevel : contestLevel=="NA" ? 0 : parseInt(contestLevel),
                    contestRanking : contestRanking=="NA" ? "NA" : parseInt(contestRanking),
                    contestAttended : contestAttended=="NA" ? 0 : parseInt(contestAttended),
                    contestTopPercentage: contestTopPercentage=="NA" ? "NA" : parseInt(contestTopPercentage),
                    contestTotalParticipants: contestTotalParticipants=="NA" ? "NA" : parseInt(contestTotalParticipants.split(" ")[5]),
                }

                gfgData.contestData = contestData;
            }

            return gfgData;
            
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
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username) return res.status(400).json({message : "Username not found"});

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser) return res.status(500).json({ error: "Failed to setup browser"});

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout : 10000 });
        await page.waitForSelector('.heatMapCard_head__QlR7_', { timeout: 10000 });

        const data = await page.evaluate(() => {
            return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)["props"]["pageProps"]["heatMapData"]["result"];
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
}

export {
    getUserInfo,
    getUserSubmissions,
}