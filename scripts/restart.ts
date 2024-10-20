import { exec } from "node:child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function startLavamusic() {
    try {
        const { stdout } = await execAsync("bun start:client");
        console.log("Lavamusic started successfully:");
        console.log(stdout);
    } catch (error) {
        console.error("Failed to start Lavamusic:");
        console.error(error);
    }
}

await startLavamusic();
