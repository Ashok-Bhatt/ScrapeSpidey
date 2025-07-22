import puppeteer from "puppeteer";
import {APIError} from "../utils/APIError.js"
import {APiResponse} from "../utils/APIResponse.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.geeksforgeeks.org/user/${username}/`;

    if (!username){
        return new APIError(400, "Username not found");
    }   

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-gpu']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('.educationDetails_head_left--text__tgi9I', { timeout: 5000 });

        const data = await page.evaluate(() => {

            const getText = (element) => element?.textContent || "NA";
           
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

            const gfgData = {
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
                }
            }

            // console.log(getText(document.querySelectorAll(".problemNavbar_head_nav--text__UaGCx")[0]));

            document.querySelectorAll(".problemNavbar_head_nav--text__UaGCx").forEach((selector)=>{
                let key = (selector.textContent.split(" ")[0]).toLocaleLowerCase(), value = selector.textContent.split(" ")[1];
                value = value.slice(1, value.length-1);
                gfgData["problemsSolved"][key] = value;
            })

            return gfgData;
        });
        res.json(data);
    } catch (error) {
        throw new APIError(400, error.message);
        // res.status(500).json({ error: "Failed to fetch data", details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

export {
    getUserInfo,
}