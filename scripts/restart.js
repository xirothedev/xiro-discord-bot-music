const { exec } = require("node:child_process");

async function startLavamusic() {
    exec("bun start:client", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting application: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Error starting application: ${stderr}`);
        }
    });
}

setTimeout(startLavamusic, 5000);
