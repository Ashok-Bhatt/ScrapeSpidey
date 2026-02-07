import { app } from "./app.js";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import seedAdmin from "./seeders/admin.seeder.js";
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
