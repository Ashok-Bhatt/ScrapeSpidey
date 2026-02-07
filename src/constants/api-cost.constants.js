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
    API_POINTS_COST,
}
