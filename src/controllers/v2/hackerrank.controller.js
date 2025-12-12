import axios from "axios";
import handleError from "../../utils/errorHandler.js";

const getUserInfo = async (req, res) => {
    try {
        const username = req.query.user;
        if (!username) return res.status(400).json({ message: "Username not found" });

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://www.hackerrank.com/',
        };

        const userProfileResponse = await axios.get(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`, {
            headers: headers
        });
        const userProfileData = userProfileResponse.data["model"];

        const userSchoolResponse = await axios.get(`https://www.hackerrank.com/community/v1/hackers/${username}/hacker_schools`, {
            headers: headers
        });
        const userSchoolData = userSchoolResponse.data["data"];

        const userLinksResponse = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/links`, {
            headers: headers,
        });
        const userLinksData = userLinksResponse.data;

        const badgesResponse = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
            headers: headers,
        });
        const badgesData = badgesResponse.data["models"];

        const certificatesResponse = await axios.get(`https://www.hackerrank.com/community/v1/test_results/hacker_certificate?username=${username}`, {
            headers: headers
        });
        const certificatesData = certificatesResponse.data["data"];

        const filteredUserProfileData = {
            username: userProfileData["username"],
            country: userProfileData["country"],
            languages: userProfileData["languages"],
            created_at: userProfileData["created_at"],
            avatar: userProfileData["avatar"],
            website: userProfileData["website"],
            short_bio: userProfileData["short_bio"],
            name: userProfileData["name"],
            personal_first_name: userProfileData["personal_first_name"],
            personal_last_name: userProfileData["personal_last_name"],
            company: userProfileData["company"],
            local_language: userProfileData["local_language"],
            job_title: userProfileData["job_title"],
            jobs_headline: userProfileData["jobs_headline"],
            followers_count: userProfileData["followers_count"],
        }

        const reponseData = {
            profile: filteredUserProfileData,
            school: userSchoolData,
            links: userLinksData,
            badges: badgesData,
            certificates: certificatesData,
        }

        return res.status(200).json(reponseData);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
}

export {
    getUserInfo,
}