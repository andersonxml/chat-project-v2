import "dotenv/config";
import { app } from "./app.js";

function main() {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

main();