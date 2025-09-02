import {app} from "./app.js";
import { PORT } from "./config.js";
import { connectDB } from "./utils/db.js";

app.listen(PORT, async ()=>{
    console.log(`app running on port ${PORT}`);
    await connectDB();
})