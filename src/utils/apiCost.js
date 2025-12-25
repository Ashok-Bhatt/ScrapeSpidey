import { API_POINTS_COST } from "../constants.js";

const getApiCost = (originalUrl) => {

    const api  = API_POINTS_COST.find(api => originalUrl.includes(api.baseUrl));
    if (!api) return 0;

    let totalCost = api.cost.base;

    api.cost?.additionalQueryCost?.forEach((extra) => {
        if (originalUrl.includes(extra.query)){
            totalCost = totalCost + extra.cost;
        }
    });

    return totalCost;
}

export {
    getApiCost,
}