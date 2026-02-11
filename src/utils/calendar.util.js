const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

const getDateDetailsFromDayOfYear = (year, dayIndex) => {
    const dateObj = new Date(year, 0, dayIndex + 1);
    const dateKey = dateObj.toISOString().split('T')[0];
    const month = dateObj.getMonth() + 1;
    const dayOfMonth = dateObj.getDate();
    return { dateKey, month, dayOfMonth };
}

const scrapeGfgTooltipData = async (page, selector, tooltipSelector) => {
    try {
        await page.hover(selector);
        await page.waitForSelector(tooltipSelector, { visible: true, timeout: 3000 });

        const result = await page.$eval(tooltipSelector, el => {
            const submissionText = el.textContent.trim();

            const countMatch = submissionText.match(/\d+/);
            const count = countMatch ? parseInt(countMatch[0], 10) : 0;

            const dateTextMatch = submissionText.match(/on\s+(.*)/i);
            const dateText = dateTextMatch ? dateTextMatch[1].trim() : null;

            let formattedDate = null;

            if (dateText) {
                const dateObj = new Date(dateText);

                if (!isNaN(dateObj)) {
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    formattedDate = `${year}-${month}-${day}`;
                }
            }

            return { count: count, date: formattedDate };
        });

        await page.mouse.move(1, 1);
        await new Promise(resolve => setTimeout(resolve, 100));

        return { count: result.count, date: result.date };

    } catch (e) {
        console.log(e.message);
        return { count: 0, date: null };
    }
};

const getSortedHeatmap = (heatmap) => {
    const finalSortedHeatmap = {};
    Object.keys(heatmap).sort().forEach(key => {
        finalSortedHeatmap[key] = heatmap[key];
    });

    return finalSortedHeatmap;
}

const getNormalizedCodeChefHeatmap = (heatmap) => {
    // Input validation
    if (!heatmap || typeof heatmap !== 'object' || Array.isArray(heatmap)) {
        return {};
    }

    const yearlyData = {};

    for (const key in heatmap) {
        if (heatmap.hasOwnProperty(key)) {

            // --- 1. Normalize the Date Key (CodeChef format: YYYY-M-D) ---
            const parts = key.split('-');

            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                let month = parts[1];
                let day = parts[2];

                // Pad the month and day with a leading '0'
                month = month.padStart(2, '0');
                day = day.padStart(2, '0');

                // Reconstruct the date in YYYY-MM-DD format
                const normalizedKey = `${parts[0]}-${month}-${day}`;
                const value = heatmap[key];

                // --- 2. Group by Year ---

                // Ensure the year object exists in the result
                if (!yearlyData[year]) {
                    yearlyData[year] = {};
                }

                // Assign the submission count to the normalized date key within the year
                yearlyData[year][normalizedKey] = value;
            }
        }
    }

    // --- 3. Optional: Sort Dates within Each Year ---
    // Although not strictly necessary for JSON, sorting ensures predictable output.
    for (const year in yearlyData) {
        if (yearlyData.hasOwnProperty(year)) {
            const sortedDates = {};
            Object.keys(yearlyData[year]).sort().forEach(dateKey => {
                sortedDates[dateKey] = yearlyData[year][dateKey];
            });
            yearlyData[year] = sortedDates;
        }
    }

    return yearlyData;
};

const getNormalizedLeetCodeHeatmap = (heatmap, year) => {
    if (!heatmap || typeof heatmap !== 'object' || Array.isArray(heatmap) || typeof year !== 'number' || year < 1900) {
        return {};
    }

    const completedHeatmap = {};

    // --- 1. Normalize ALL Existing Data ---
    // Convert all timestamp keys into YYYY-MM-DD format, regardless of the year.
    for (const timestampKey in heatmap) {
        if (heatmap.hasOwnProperty(timestampKey)) {
            const timestampSeconds = parseInt(timestampKey, 10);
            const timestampMilliseconds = timestampSeconds * 1000;
            const date = new Date(timestampMilliseconds);

            // Use UTC methods for consistent date representation
            const y = date.getUTCFullYear();
            const m = String(date.getUTCMonth() + 1).padStart(2, '0');
            const d = String(date.getUTCDate()).padStart(2, '0');

            const normalizedKey = `${y}-${m}-${d}`;
            completedHeatmap[normalizedKey] = heatmap[timestampKey];
        }
    }

    // --- 2. Fill Missing Dates ONLY for the Specified Year ---

    // Find the start date for the target year (Jan 1) and the end date (Dec 31)
    const startDate = new Date(Date.UTC(year, 0, 1));   // Month 0 is Jan
    const endDate = new Date(Date.UTC(year, 11, 31)); // Month 11 is Dec

    // Loop through every day from Jan 1st to Dec 31st of the target year.
    for (let currentDate = startDate; currentDate <= endDate; currentDate.setUTCDate(currentDate.getUTCDate() + 1)) {

        const currentYear = currentDate.getUTCFullYear();

        // This check is crucial: ensure we only add/modify dates belonging to the target year.
        if (currentYear === year) {

            // Format the current date to YYYY-MM-DD
            const currentMonth = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
            const currentDay = String(currentDate.getUTCDate()).padStart(2, '0');
            const dateKey = `${currentYear}-${currentMonth}-${currentDay}`;

            // If the date is missing for the target year, add it with value 0
            if (!completedHeatmap.hasOwnProperty(dateKey)) {
                completedHeatmap[dateKey] = 0;
            }
        }
    }

    return getSortedHeatmap(completedHeatmap);
};

const getNormalizedInterviewBitHeatmap = (heatmap, year) => {
    if (!heatmap || typeof heatmap !== 'object' || Array.isArray(heatmap) || typeof year !== 'number' || year < 1900) {
        return {};
    }

    const getAllDatesInYear = (y) => {
        const dates = [];
        let date = new Date(y, 0, 1);
        const end = new Date(y + 1, 0, 1);

        while (date < end) {
            const yearStr = date.getFullYear();
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(date.getDate()).padStart(2, '0');

            dates.push(`${yearStr}-${monthStr}-${dayStr}`);
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    const allDates = getAllDatesInYear(year);

    const normalizedHeatmap = {};

    allDates.forEach(date => {
        normalizedHeatmap[date] = heatmap[date] || 0;
    });

    return getSortedHeatmap(normalizedHeatmap);
};

const getNormalizedCode360Heatmap = (heatmap, year) => {
    if (!heatmap || typeof heatmap !== 'object' || Array.isArray(heatmap) || typeof year !== 'number' || year < 1900) {
        return {};
    }

    const getAllDatesInYear = (y) => {
        const dates = [];
        let date = new Date(y, 0, 1);
        const end = new Date(y + 1, 0, 1);

        while (date < end) {
            const yearStr = date.getFullYear();
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(date.getDate()).padStart(2, '0');

            dates.push(`${yearStr}-${monthStr}-${dayStr}`);
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    const allDates = getAllDatesInYear(year);

    const normalizedHeatmap = {};

    allDates.forEach(date => {
        normalizedHeatmap[date] = heatmap[date]?.total || 0;
    });

    return getSortedHeatmap(normalizedHeatmap);
}

const getNormalizedGfgHeatmap = (heatmap, year) => {
    if (!heatmap || typeof heatmap !== 'object' || Array.isArray(heatmap) || typeof year !== 'number' || year < 1900) {
        return {};
    }

    const getAllDatesInYear = (y) => {
        const dates = [];
        let date = new Date(y, 0, 1);
        const end = new Date(y + 1, 0, 1);

        while (date < end) {
            const yearStr = date.getFullYear();
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(date.getDate()).padStart(2, '0');

            dates.push(`${yearStr}-${monthStr}-${dayStr}`);
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    const allDates = getAllDatesInYear(year);

    const normalizedHeatmap = {};

    allDates.forEach(date => {
        normalizedHeatmap[date] = heatmap[date] || 0;
    });

    return getSortedHeatmap(normalizedHeatmap);
}

export {
    isLeapYear,
    getDateDetailsFromDayOfYear,
    getSortedHeatmap,
    scrapeGfgTooltipData,
    getNormalizedCodeChefHeatmap,
    getNormalizedLeetCodeHeatmap,
    getNormalizedInterviewBitHeatmap,
    getNormalizedCode360Heatmap,
    getNormalizedGfgHeatmap,
}
