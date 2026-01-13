const DAILY_API_POINT_LIMIT = 100;

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const LEETCODE_GRAPHQL_QUERIES = {
    userProfile : `
        query userProfileInfo($username: String!) {
            matchedUser(username: $username) {
                username
                githubUrl
                twitterUrl
                linkedinUrl
                profile {
                    ranking
                    userAvatar
                    realName
                    aboutMe
                    school
                    websites
                    countryName
                    company
                    jobTitle
                    skillTags
                    postViewCount
                    postViewCountDiff
                    reputation
                    reputationDiff
                    solutionCount
                    solutionCountDiff
                    categoryDiscussCount
                    categoryDiscussCountDiff
                    certificationLevel
                }
            }
        }
    `,

    userLanguageStats : `
        query languageStats($username: String!) {
            matchedUser(username: $username){
                languageProblemCount {
                    languageName
                    problemsSolved
                }
            }
        }
    `,

    userContestRankings : `
        query userContestRankingInfo($username: String!) {
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                totalParticipants
                topPercentage
                badge {
                    name
                    icon
                }
            }
            userContestRankingHistory(username: $username) {
                attended
                trendDirection
                problemsSolved
                totalProblems
                finishTimeInSeconds
                rating
                ranking
                contest {
                    title
                    startTime
                }
            }
        }
    `,

    userProfileUserQuestionProgressV2: `
        query userProfileUserQuestionProgressV2($userSlug: String!) {
            userProfileUserQuestionProgressV2(userSlug: $userSlug) {
                numAcceptedQuestions {
                    count
                    difficulty
                }
                numFailedQuestions {
                    count
                    difficulty
                }
                numUntouchedQuestions {
                    count
                    difficulty
                }
                userSessionBeatsPercentage {
                    difficulty
                    percentage
                }
                totalQuestionBeatsPercentage
            }
        }
    `,

    userSessionProgress: `
        query userSessionProgress($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                    totalSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }
    `,

    userBadges: `
        query userBadges($username: String!) {
            matchedUser(username: $username) {
                activeBadge {
                    displayName
                    icon
                }
                badges {
                    id
                    name
                    shortName
                    displayName
                    icon
                    hoverText
                    medal {
                        slug
                        config {
                            iconGif
                            iconGifBackground
                        }
                    }
                    creationDate
                    category
                }
                upcomingBadges {
                    name
                    icon
                    progress
                }
            }
        }
    `,

    createdPublicFavoriteList: `
        query createdPublicFavoriteList($userSlug: String!) {
            createdPublicFavoriteList(userSlug: $userSlug) {
                hasMore
                totalLength
                favorites {
                    slug
                    coverUrl
                    coverEmoji
                    coverBackgroundColor
                    name
                    isPublicFavorite
                    lastQuestionAddedAt
                    hasCurrentQuestion
                    viewCount
                    description
                    questionNumber
                    isDefaultList
                }
            }
        }
    `,

    userProfileCalendar: `
        query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
                userCalendar(year: $year) {
                    activeYears
                    streak
                    totalActiveDays
                    dccBadges {
                        timestamp
                        badge {
                            name
                            icon
                        }
                    }
                    submissionCalendar
                }
            }
        }
    `,

    recentAcSubmissions: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
                id
                title
                titleSlug
                timestamp
            }
        }
    `,

    contestRatingHistogram: `
        query contestRatingHistogram {
            contestRatingHistogram {
                userCount
                ratingStart
                ratingEnd
                topPercentage
            }
        }
    `,

    questionOfToday: `
        query questionOfToday {
            activeDailyCodingChallengeQuestion {
                date
                userStatus
                link
                question {
                    titleSlug
                    title
                    translatedTitle
                    acRate
                    difficulty
                    freqBar
                    frontendQuestionId: questionFrontendId
                    isFavor
                    paidOnly: isPaidOnly
                    status
                    hasVideoSolution
                    hasSolution
                    topicTags {
                        name
                        id
                        slug
                    }
                }
            }
        }
    `,

    codingChallengeMedal: `
        query codingChallengeMedal($year: Int!, $month: Int!) {
            dailyChallengeMedal(year: $year, month: $month) {
                name
                config {
                    icon
                }
            }
        }
    `,

    skillStats: `
        query skillStats($username: String!) {
            matchedUser(username: $username) {
                tagProblemCounts {
                    advanced {
                        tagName
                        tagSlug
                        problemsSolved
                    }
                    intermediate {
                        tagName
                        tagSlug
                        problemsSolved
                    }
                    fundamental {
                        tagName
                        tagSlug
                        problemsSolved
                    }
                }
            }
        }
    `    
}

const API_POINTS_COST = [

    // Code360 Endpoints
    {
        baseUrl: "/api/v1/code360/user/profile",
        cost: {
            base: 1,
            additionalQueryCost: [
                {
                    query: "includeContests=true",
                    cost: 0.5,
                },
            ],
        },
    },
    {
        baseUrl: "/api/v1/code360/user/submissions",
        cost: {
            base: 1,
        },
    },

    // GFG Endpoints
    {
        baseUrl: "/api/v1/gfg/user/profile",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v1/gfg/user/submissions",
        cost: {
            base: 5,
        },
    },
    {
        baseUrl: "/api/v1/gfg/user/problems",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v1/gfg/institution/top-3",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v1/gfg/institution/info",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v2/gfg/user/submissions",
        cost: {
            base: 1,
        },
    },

    // CodeChef Endpoints
    {
        baseUrl: "/api/v1/codechef/user/profile",
        cost: {
            base: 1,
            additionalQueryCost: [
                {
                    query: "includeContests=true",
                    cost: 0.5,
                },
                {
                    query: "includeAchievements=true",
                    cost: 0.5,
                },
            ],
        },
    },
    {
        baseUrl: "/api/v1/codechef/user/submissions",
        cost: {
            base: 3,
        },
    },

    // HackerRank Endpoints
    {
        baseUrl: "/api/v1/hackerrank/user/profile",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v2/hackerrank/user/profile",
        cost: {
            base: 1,
        },
    },

    // InterviewBit Endpoints
    {
        baseUrl: "/api/v1/interviewbit/user/profile",
        cost: {
            base: 1,
            additionalQueryCost: [
                {
                    query: "includeSubmissionStats=true",
                    cost: 0.5,
                },
                {
                    query: "includeBadges=true",
                    cost: 0.5,
                },
            ],
        },
    },
    {
        baseUrl: "/api/v1/interviewbit/user/submissions",
        cost: {
            base: 3,
        },
    },
    {
        baseUrl: "/api/v1/interviewbit/user/badges",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v2/interviewbit/user/profile",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "/api/v2/interviewbit/user/submissions",
        cost: {
            base: 1,
        },
    },  

    // Github Endpoints
    {
        baseUrl: "/api/v1/github/user/badges",
        cost: {
            base: 1,
        },
    },

    // LeetCode Endpoints
    {
        baseUrl: "leetcode/user/profile",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/language-stats",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/calendar",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/recent-submissions",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/badges",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/contest-ranking",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/skill-stats",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/question-progress",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/user/session-progress",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/contest/histogram",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/question/today",
        cost: {
            base: 1,
        },
    },
    {
        baseUrl: "leetcode/coding-challenge/medal",
        cost: {
            base: 1,
        },
    },
];

export {
    DAILY_API_POINT_LIMIT,
    LEETCODE_GRAPHQL_ENDPOINT,
    LEETCODE_GRAPHQL_QUERIES,
    API_POINTS_COST,
}