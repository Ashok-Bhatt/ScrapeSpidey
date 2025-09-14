import {configChromeDriver} from "../utils/chromeDriver.js"

const getUserInfo = async (req, res) => {
    const username = req.params.user;
    const url = `https://www.naukri.com/code360/profile/${username}/`;

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
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Chromium";v="120", "Not=A?Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        });
        await page.goto(url, { waitUntil: 'networkidle2', timeout : 2*60*1000 });
        await page.waitForSelector('.profile-user-name', { timeout: 10000 });

        const data = await page.evaluate((username) => {

            const CODE360_DOMAIN = "https://www.naukri.com/code360/profile";

            const getText = (element) => element?.textContent || "NA";

            const profileImageElement = document.querySelector(".user-profile-pic-container img");
            const mcqCountElement = Array.from(document.querySelectorAll(".mcq-row div"))[2];
            const problemsCountElement = Array.from(document.querySelectorAll(".coding-row div"))[2];
            const profileViewCountElement = document.querySelector(".profile-view-counter .count");
            const submissionCountElement = document.querySelector(".profile-user-stats-graph-container .left.zen-typo-heading-5");
            const streakElement = Array.from(document.querySelectorAll(".day-count-text"));
            const contestRatingElement = document.querySelector(".rating-info .rating");
            const contestRankingElement = document.querySelector(".ranking-info .rating");
            const contestTopPercentageElement = document.querySelector(".ranking-info .zen-typo-caption-medium");
            const contestBadgeElement = document.querySelector(".ranking img");
            const contestSubmissionElement = document.querySelector(".submission-details-left span");
            const contestAttendedElement = document.querySelector(".submission-details");
            const certificatesElement = Array.from(document.querySelectorAll(".certificate-list .btn-ent"));
            const totalDsaProblemsCountElement = document.querySelector(".problems-solved .total")
            const dsaProblemsCountElement = Array.from(document.querySelectorAll(".problems-solved .difficulty"));
            const totalWebDevProblemsCountElement = document.querySelector("codingninjas-web-development-domain-card .problem-solved .solved .value");
            const webDevProblemsCountElement = Array.from(document.querySelectorAll("codingninjas-web-development-domain-card .problem-solved .distinction .information"));
            const totalDataScienceProblemsCountElement = document.querySelector("codingninjas-analytics-and-ds-domain-card .problem-solved .solved .value");
            const dataScienceProblemsCountElement = Array.from(document.querySelectorAll("codingninjas-analytics-and-ds-domain-card .problem-solved .distinction .information"));

            const mcqCount = getText(mcqCountElement);
            const codingProblemsCount = getText(problemsCountElement);
            const currentStreak = getText(streakElement[0]);
            const maxStreak = getText(streakElement[1]);

            const certificates = certificatesElement.map((certificate)=> getText(certificate));

            const totalDsaProblemsCount = getText(totalDsaProblemsCountElement);
            const totalWebDevProblemsCount = getText(totalWebDevProblemsCountElement);
            const totalDataScienceProblemsCount = getText(totalDataScienceProblemsCountElement);

            const dsaProblemsCount = dsaProblemsCountElement.map((element)=>{
                return {
                    tag : getText(element.querySelector(".title")),
                    count : parseInt(getText(element.querySelector(".value"))),
                }
            })

            const webDevProblemsCount = webDevProblemsCountElement.map((element)=>{
                return {
                    tag : getText(element).split(" ")[1],
                    count : parseInt(getText(element.querySelector(".value"))),
                }
            })

            const dataScienceProblemsCount = dataScienceProblemsCountElement.map((element)=>{
                return {
                    tag : getText(element).split(" ")[1],
                    count : parseInt(getText(element.querySelector(".value"))),
                }
            })

            const problemsCount = {
                totalProblems : codingProblemsCount == "NA" ? 0 : parseInt(codingProblemsCount.split(" ")[1].slice(1,-1)),
                data : {
                    "Data Structures And Algorithms" : {
                        "Total Problems" : totalDsaProblemsCount != "NA" ? parseInt(totalDsaProblemsCount.split(" ")[1]) : 0,
                            "Problems Stats" : dsaProblemsCount,
                        },
                    "Web Development" : {
                        "Total Problems" : totalWebDevProblemsCount != "NA" ? parseInt(totalWebDevProblemsCount) : 0,
                        "Problems Stats" : webDevProblemsCount,
                    },
                    "Analytics and Data Science" : {
                        "Total Problems" : totalDataScienceProblemsCount != "NA" ? parseInt(totalDataScienceProblemsCount) : 0,
                        "Problems Stats" : dataScienceProblemsCount,
                    }
                },
            }

            const contestData = contestAttendedElement ? {
                contestRating : parseInt(getText(contestRatingElement)),
                contestRanking : getText(contestRankingElement).trim(),
                contestTopPercentage : parseInt(getText(contestTopPercentageElement).split(" ").at(-2).slice(0,-1)),
                contestBadge : contestBadgeElement?.getAttribute("src"),
                contestSubmissions : parseInt(getText(contestSubmissionElement)),
                contestAttended : parseInt(getText(contestAttendedElement).split(" ")[0]),
            } : null;


            const code360Data = {
                username: username,
                profileImage : profileImageElement?.getAttribute("src"),
                mcqCount : mcqCount == "NA" ? 0 : parseInt(mcqCount.split(" ")[1].slice(1,-1)),
                profileViewCount : parseInt(getText(profileViewCountElement)),
                submissionCount : parseInt(getText(submissionCountElement)),
                currentStreak : parseInt(currentStreak.split(" ")[1]),
                maxStreak : parseInt(maxStreak.split(" ")[1]),
                contestData : contestData,
                // certificates : certificates,
                problemsCount : problemsCount,
                contestData : contestData,

            };

            return code360Data;
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