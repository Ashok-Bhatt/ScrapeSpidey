import { app } from "./app.js";
import { PORT } from "./config.js";
import { connectDB } from "./utils/db.js";
import seedAdmin from "./utils/seedAdmin.js";
import { initBrowser } from "./config/browser.config.js";

app.listen(PORT, async () => {
    console.log(`app running on port ${PORT}`);
    await connectDB();
    await seedAdmin();
    try {
        await initBrowser();
        console.log("Browser initialized");
    } catch (error) {
        console.error("Failed to initialize browser:", error);
    }
})