const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const LEETCODE_GRAPHQL_QUERIES = {
    userProfile: `
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

    userLanguageStats: `
        query languageStats($username: String!) {
            matchedUser(username: $username){
                languageProblemCount {
                    languageName
                    problemsSolved
                }
            }
        }
    `,

    userContestRankings: `
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

export {
    LEETCODE_GRAPHQL_ENDPOINT,
    LEETCODE_GRAPHQL_QUERIES,
}
