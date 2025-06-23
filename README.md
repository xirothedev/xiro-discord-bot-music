# Shiroko Discord Bot Music

A powerful, multi-feature Discord music bot supporting YouTube, Spotify, Apple Music, and more. Built for scalability, premium features, and easy self-hosting.

---

## Key Features
- 🎵 **Universal Music Playback**: Supports YouTube, Spotify, Apple Music, SoundCloud, Bandcamp, and more
- 📃 **Lyrics & Advanced Search**: Find lyrics, search by keywords, URLs, or ISRC codes
- 🎚️ **Audio Filters**: Bassboost, nightcore, karaoke, pitch, speed, tremolo, vibrato, lowpass, and more
- 🔁 **Queue & Playlist Management**: Create, edit, load, and share custom playlists; advanced queue controls
- 🏆 **Premium System**: User/guild premium with track/playlist limits, exclusive features
- 🌐 **Multi-language**: English, Vietnamese, Japanese, Korean, Indonesian (auto-detect, easy to extend)
- 🛡️ **Admin & Dev Tools**: Language switching, premium management, eval, restart, register, revoke, and more
- 🤖 **Modern Discord.js**: Slash commands, prefix commands, rich embeds, and component interactions
- 🚀 **Scalable & Container-ready**: Docker, Docker Compose, and Bun support for easy deployment
- 🧩 **Plugin-ready Lavalink**: Easily extendable with new music sources and plugins

---

## Command List (Prefix: `!` by default)

### Music & Playback
- `!play <song/url>` — Play a song from YouTube, Spotify, etc.
- `!playnext <song/url>` — Add a song to play next
- `!pause` / `!resume` — Pause or resume playback
- `!skip` — Skip current track
- `!replay` — Replay the current track
- `!seek <time>` — Seek to a specific time in the track
- `!volume <0-200>` — Set playback volume
- `!queue` — Show current queue
- `!clearqueue` — Clear the queue
- `!shuffle` — Shuffle the queue
- `!remove <index>` — Remove a track from the queue
- `!nowplaying` — Show info about the current track
- `!autoplay` — Toggle autoplay
- `!loop [track|queue|off]` — Loop track or queue
- `!join` / `!leave` — Join or leave voice channel

### Filters
- `!filters bassboost` / `!filters nightcore` / `!filters karaoke` / ... — Apply audio filters
- `!filters reset` — Reset all filters

### Playlist
- `!playlist create <name>` — Create a new playlist
- `!playlist add <name> <song>` — Add a song to a playlist
- `!playlist remove <name> <index>` — Remove a song from a playlist
- `!playlist load <name>` — Load a playlist into the queue
- `!playlist delete <name>` — Delete a playlist
- `!playlist` — List your playlists
- `!playlist steal <user> <name>` — Copy another user's playlist

### Info & Utility
- `!help [command]` — Show all commands or help for a specific command
- `!ping` — Check bot latency
- `!premium` — Check your premium status
- `!lyric [song]` — Get lyrics for the current or specified song

### Admin & Dev
- `!language <lang>` — Change bot language
- `!addpremium <user/guild>` — Grant premium
- `!revokepremium <user/guild>` — Revoke premium
- `!eval <code>` — Evaluate code (owner only)
- `!restart` — Restart the bot
- `!register` — Register a new bot instance
- `!data` — Show debug data

---

## Upcoming Features
- 🎤 **Voice Recording & Transcription**
- 🗂️ **Playlist Import/Export (Spotify, YouTube, etc.)**
- 🕹️ **Web Dashboard for Bot Management**
- 📊 **Usage Analytics & Statistics**
- 🔒 **Granular Permission Controls**
- 🧩 **More Music Sources & Filters**
- 🌍 **More Languages & Auto-translation**
- 🛠️ **CI/CD Workflow & One-click Deploy Scripts**

---

## Quick Start

### 1. Requirements
- [Bun](https://bun.sh/) (runtime)
- Node.js 18+ (for some dependencies)
- [Lavalink](https://github.com/lavalink-devs/Lavalink) server (for music streaming)
- PostgreSQL (for user and premium data)
- Redis (optional, for caching)

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/xirothedev/shiroko-discord-bot-music.git
cd shiroko-discord-bot-music

# Install dependencies
bun install
```

### 3. Configuration
- Copy and edit config files:
  - `cp application.example.yaml application.yaml` (Lavalink config)
  - `cp compose.example.yaml docker-compose.yaml` (if using Docker Compose)
- Set up environment variables (see `.env.prod` or required keys below):

**Required ENV variables:**
```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
GUILD_ID=your_guild_id
LAVALINK_SERVER_PASSWORD=your_lavalink_password
LAVALINK_SERVER_HOST=localhost
LAVALINK_SERVER_PORT=2333
GENIUS_ACCESS_TOKEN=your_genius_token
DISCORD_BOT_TOKEN=your_discord_token
DISCORD_BOT_ID=your_bot_id
PREFIX=!
```

- Edit `bots.json` with your bot tokens, client IDs, and prefixes.
- Edit `application.yaml` for Lavalink plugins and sources as needed.

### 4. Database Migration
```bash
bun x prisma db push
```

### 5. Run the Bot
```bash
bun run src/index.ts
```

---

## Docker & Docker Compose

### Docker
```bash
docker build -t shiroko-bot .
docker run --env-file .env.prod shiroko-bot
```

### Docker Compose
Edit `docker-compose.yaml` as needed, then:
```bash
docker compose up -d
```

---

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Code of Conduct
By contributing or using this project, you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Disclaimer & Warning
- This project is for educational and personal use. Use at your own risk.
- You are responsible for complying with Discord's Terms of Service and the terms of any music/content providers.
- The author is not responsible for any misuse, bans, or damages caused by self-hosting or modifying this bot.

---

## Contact & Support
- Author: [Xiro The Dev](https://www.facebook.com/xirothedev/)
- Email: lethanhtrung.trungle@gmail.com
- GitHub Issues: https://github.com/xirothedev/shiroko-discord-bot-music/issues
