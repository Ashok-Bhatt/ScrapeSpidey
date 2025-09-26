const apiPointsCost = [
    {
        baseUrl: "gfg/user/profile",
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
        baseUrl: "gfg/user/submissions",
        cost: {
            base: 1,
            additionalQueryCost: [],
        },
    },
    {
        baseUrl: "codechef/user/profile",
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
        baseUrl: "codechef/user/submissions",
        cost: {
            base: 1,
            additionalQueryCost: [],
        },
    },
    {
        baseUrl: "hackerrank/user/profile",
        cost: {
            base: 1,
            additionalQueryCost: [],
        },
    },
    {
        baseUrl: "interviewbit/user/profile",
        cost: {
            base: 1,
            additionalQueryCost: [],
        },
    },
    {
        baseUrl: "code360/user/profile",
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
        baseUrl: "github/user/badges",
        cost: {
            base: 1,
            additionalQueryCost: [],
        },
    },
];

const getApiCost = (originalUrl) => {

    const api  = apiPointsCost.find(api => originalUrl.includes(api.baseUrl));
    if (!api) return 0;

    let totalCost = api.cost.base;

    api.cost.additionalQueryCost.forEach((extra) => {
        if (originalUrl.includes(extra.query)){
            totalCost = totalCost + extra.cost;
        }
    });

    return totalCost;
}

export {
    getApiCost,
}