import {app} from "./app.js";
import { PORT } from "./config.js";

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})