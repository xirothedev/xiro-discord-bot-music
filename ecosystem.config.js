export default {
    apps: [
        {
            name: "multi discord bot",
            script: "./src/index.ts",
            exec_mode: "cluster",
            max_memory_restart: "2G",
            autorestart: false,
        },
    ],
};
