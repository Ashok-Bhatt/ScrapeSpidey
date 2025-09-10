import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username) {
        return res.status(400).json({message : "Username not found"});
    }

    let browser;
    let page;
    try {
        browser = await configChromeDriver();

        if (!browser) {
            res.status(500).json({ error: "Failed to setup browser" });
        }

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 2 * 60 * 1000 });
        await page.waitForSelector('.educationDetails_head_left--text__tgi9I', { timeout: 5000 });

        const data = await page.evaluate(() => {
            const getText = (element) => element?.textContent || "NA";

            const username = getText(document.querySelector(".profilePicSection_head_userHandle__oOfFy"));
            const avatar = document.querySelector(".profilePicSection_head_img__1GLm0 > span > img")?.getAttribute("src") || "NA";
            const institutionName = getText(document.querySelector(".educationDetails_head_left--text__tgi9I"));
            const institutionRank = getText(document.querySelector(".educationDetails_head_left_userRankContainer--text__wt81s b"))?.split(" ")[0];
            const languagesUsed = getText(document.querySelector(".educationDetails_head_right--text__lLOHI"));
            const userMaxStreak = Array.from(document.querySelector(".circularProgressBar_head_mid_streakCnt__MFOF1").childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join(' ').trim();
            let globalMaxStreak = getText(document.querySelector(".circularProgressBar_head_mid_streakCnt--glbLongStreak__viuBP")) || "NA";
            const contestRating = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[0]);
            const contestLevel = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[1]);
            const contestRanking = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[2]);
            const contestAttended = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[3]);
            let contestTopPercentage = document.querySelector(".contestDetailsCard_head__0MvGa > p")?.textContent.split(" ")[3] || "NA";
            const contestTotalParticipants = document.querySelector(".contestDetailsCard_head__0MvGa > p")?.textContent.split(" ")[5] || "NA";
            let codingScore = getText(document.querySelectorAll(".scoreCard_head_left--score__oSi_x")[0]);
            const totalProblemsSolved = getText(document.querySelectorAll(".scoreCard_head_left--score__oSi_x")[1]);

            if (globalMaxStreak !== "NA") globalMaxStreak = globalMaxStreak.slice(1);
            if (contestTopPercentage !== "NA") contestTopPercentage = contestTopPercentage.slice(0, contestTopPercentage.length - 1);
            if (codingScore === "__") codingScore = "0";
            const avatarUrl = avatar !== "NA" ? "https://www.geeksforgeeks.org/" + avatar : "NA";

            const problemsSolved = {
                total: totalProblemsSolved === "__" ? "0" : totalProblemsSolved,
            };

            document.querySelectorAll(".problemNavbar_head_nav--text__UaGCx").forEach((selector) => {
                const key = selector.textContent.split(" ")[0].toLocaleLowerCase();
                let value = selector.textContent.split(" ")[1];
                value = value.slice(1, value.length - 1);
                problemsSolved[key] = value;
            });

            return {
                username : username,
                avatar: avatarUrl,
                institutionName : institutionName,
                institutionRank : institutionRank,
                languagesUsed : languagesUsed,
                userMaxStreak : userMaxStreak,
                globalMaxStreak : globalMaxStreak,
                contestRating : contestRating,
                contestLevel : contestLevel,
                contestRanking : contestRanking,
                contestAttended : contestAttended,
                contestTopPercentage : contestTopPercentage,
                contestTotalParticipants : contestTotalParticipants,
                codingScore : codingScore,
                problemsSolved : problemsSolved,
            };
        });
        
        res.status(200).json(data);
        browser.close();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

const getUserSubmissions = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username){
        return res.status(400).json({message : "Username not found"});
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
        await page.waitForSelector('.heatMapCard_head__QlR7_', { timeout: 15000 });

        const data = await page.evaluate(() => {
            return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)["props"]["pageProps"]["heatMapData"]["result"];
        });

        res.status(200).json(data);
        browser.close();
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
}

export {
    getUserInfo,
    getUserSubmissions,
}