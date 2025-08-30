import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer"
import {APIError} from "../utils/APIError.js"
import {BROWSERLESS_TOKEN, NODE_ENV } from "../config.js";

const configChromiumDriver = async () => {
    if (NODE_ENV == "development"){
        return await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
    } else {
        return await puppeteerCore.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?token=${BROWSERLESS_TOKEN}`,
        });
    }
}

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username){
        return new APIError(400, "Username not found");
    }

    let browser;
    let page;
    try {
        browser = await configChromiumDriver();

        if (!browser){
            res.status(500).json({ error: "Failed to setup browser"});
        }

        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout : 2*60*1000 });
        await page.waitForSelector('.educationDetails_head_left--text__tgi9I', { timeout: 5000 });

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";
           
            let username = getText(document.querySelector(".profilePicSection_head_userHandle__oOfFy"));
            let avatar = document.querySelector(".profilePicSection_head_img__1GLm0 > span > img")?.getAttribute("src") || "NA";
            let institutionName = getText(document.querySelector(".educationDetails_head_left--text__tgi9I"));
            let institutionRank = getText(document.querySelector(".educationDetails_head_left_userRankContainer--text__wt81s b"))?.split(" ")[0];
            let languagesUsed = getText(document.querySelector(".educationDetails_head_right--text__lLOHI"));
            let userMaxStreak = Array.from(document.querySelector(".circularProgressBar_head_mid_streakCnt__MFOF1").childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join(' ').trim();
            let globalMaxStreak = getText(document.querySelector(".circularProgressBar_head_mid_streakCnt--glbLongStreak__viuBP")) || "NA";
            let contestRating = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[0]);
            let contestLevel = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[1]);
            let contestRanking = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[2]);
            let contestAttended = getText(document.querySelectorAll(".contestDetailsCard_head_detail--text__NG_ae")[3]);
            let contestTopPercentage = document.querySelector(".contestDetailsCard_head__0MvGa > p")?.textContent.split(" ")[3] || "NA";
            let contestTotalParticipants = document.querySelector(".contestDetailsCard_head__0MvGa > p")?.textContent.split(" ")[5] || "NA";
            let codingScore = getText(document.querySelectorAll(".scoreCard_head_left--score__oSi_x")[0]);
            let totalProblemsSolved = getText(document.querySelectorAll(".scoreCard_head_left--score__oSi_x")[1]);

            if (globalMaxStreak != "NA") globalMaxStreak = globalMaxStreak.slice(1, globalMaxStreak.length);
            if (contestTopPercentage != "NA") contestTopPercentage = contestTopPercentage.slice(0, contestTopPercentage.length-1);
            if (codingScore == "__") codingScore = "0";
            if (avatar != "NA") avatar = "https://www.geeksforgeeks.org/" + avatar;

            const gfgData = {
                username,
                avatar,
                institutionName,
                institutionRank,
                languagesUsed,
                userMaxStreak,
                globalMaxStreak,
                contestRating,
                contestLevel,
                contestRanking,
                contestAttended,
                contestTopPercentage,
                contestTotalParticipants,
                codingScore,
                problemsSolved : {
                    total : totalProblemsSolved==="__" ? "0" : totalProblemsSolved,
                },
            }

            document.querySelectorAll(".problemNavbar_head_nav--text__UaGCx").forEach((selector)=>{
                let key = (selector.textContent.split(" ")[0]).toLocaleLowerCase(), value = selector.textContent.split(" ")[1];
                value = value.slice(1, value.length-1);
                gfgData["problemsSolved"][key] = value;
            })

            return gfgData;
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

const getUserSubmissions = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username){
        return new APIError(400, "Username not found");
    }

    let browser;
    let page;
    try {
        browser = await configChromiumDriver();

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