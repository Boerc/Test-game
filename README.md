# Twitch Interactive Game System

A comprehensive Twitch bot featuring 4 interactive games that viewers can control through chat commands. Perfect for engaging your stream audience with collaborative gameplay!

## 🎮 Available Games

### 1. **Adventure Quest** (!adventure)
**Story-driven choice game where viewers vote on decisions**
- Collaborative storytelling with branching narratives
- Viewers vote A/B/C on story choices  
- 3 exciting scenes with multiple endings
- Auto-advancing story based on majority vote

**Commands:**
- `!adventure` - Start a new adventure
- `!choice A/B/C` - Vote on story decisions
- `!story` - View current scene

### 2. **Number Battle** (!numberbattle)
**Competitive number guessing with leaderboards**
- Guess the secret number within range
- Multiple difficulty levels (easy: 1-50, normal: 1-100, hard: 1-500)
- Persistent leaderboard system
- Heat-based hints (🔥 very close, ❄️ cold)

**Commands:**
- `!numberbattle` - Start new round
- `!guess <number>` - Make your guess
- `!difficulty easy/normal/hard` - Change difficulty
- `!leaderboard` - View top players

### 3. **Virtual Pet Sanctuary** (!pet)
**Collaborative pet care simulation**
- Community-managed virtual pet
- Multiple care activities affect pet stats
- Pet levels up through viewer interaction
- Real-time stat decay encourages regular care

**Commands:**
- `!feed` - Give food (reduces hunger)
- `!play` - Play games (increases happiness)
- `!sleep` - Rest time (restores energy)
- `!pet` - Show affection
- `!treat` - Give special treats
- `!adopt <name>` - Adopt new pet
- `!status` - Check pet condition

### 4. **Arena Combat** (!arena)
**Turn-based battle system with viewer-controlled actions**
- Epic battles against random enemies
- Viewers vote on combat actions
- Team-based combat with shared health/mana
- Experience points and ranking system

**Commands:**
- `!arena` - Start new battle
- `!attack` - Vote for attack action
- `!defend` - Vote for defensive action
- `!magic` - Vote for magic attack
- `!special` - Vote for special ability
- `!rank` - View arena rankings

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Twitch account for the bot
- Twitch OAuth token (get from https://twitchapps.com/tmi/)

### Installation

1. **Clone and setup:**
```bash
git clone <your-repo-url>
cd Test-game
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

3. **Edit `.env` with your credentials:**
```env
TWITCH_USERNAME=your_bot_username
TWITCH_OAUTH_TOKEN=oauth:your_oauth_token_here
TWITCH_CHANNEL=your_channel_name
COMMAND_PREFIX=!
```

4. **Start the bot:**
```bash
npm start
```

### Getting Twitch Credentials

1. **Bot Username**: Create a separate Twitch account for your bot
2. **OAuth Token**: Visit https://twitchapps.com/tmi/ and generate a token
3. **Channel Name**: Your main streaming channel where the bot will operate

## 🎯 Usage

Once running, viewers can interact with:

- `!help` - Show available commands
- `!game` - Show current game status  
- `!status` - Detailed system status
- `!adventure` - Start adventure game
- `!numberbattle` - Start number guessing
- `!pet` - Start pet care game
- `!arena` - Start combat game

## 🛠️ Development

### Project Structure
```
src/
├── index.js              # Main bot entry point
├── gameController.js     # Central game management
├── utils/
│   └── chatCommandParser.js
└── games/
    ├── adventureGame.js
    ├── numberBattleGame.js
    ├── virtualPetGame.js
    └── arenaCombatGame.js
```

### Running Tests
```bash
npm test
```

### Development Mode (with auto-restart)
```bash
npm run dev
```

## 🎨 Customization

### Adding New Games
1. Create new game class in `src/games/`
2. Implement required methods: `canHandleCommand()`, `handleCommand()`, `getStatus()`
3. Add to GameController in `src/gameController.js`

### Modifying Game Behavior
- **Voting Duration**: Change timeouts in individual game files
- **Difficulty Levels**: Modify ranges in `numberBattleGame.js`
- **Pet Stats**: Adjust decay rates in `virtualPetGame.js`
- **Story Content**: Edit scenes array in `adventureGame.js`

## 📊 Features

- **Multi-Game System**: 4 distinct interactive experiences
- **Real-time Chat Integration**: Instant command processing
- **Persistent Statistics**: Leaderboards and progress tracking
- **Automatic Game Management**: Timeouts and state handling
- **Extensible Architecture**: Easy to add new games
- **Error Handling**: Graceful failure recovery
- **Viewer Engagement**: Multiple ways to participate

## 🔧 Configuration Options

Environment variables in `.env`:
- `TWITCH_USERNAME` - Bot account username
- `TWITCH_OAUTH_TOKEN` - OAuth token for authentication
- `TWITCH_CHANNEL` - Target channel name
- `COMMAND_PREFIX` - Command prefix (default: !)
- `VOTE_DURATION` - Voting timeout in milliseconds
- `MIN_VOTES` - Minimum votes required

## 🎪 Stream Integration Tips

1. **Game Rotation**: Switch between games to maintain variety
2. **Viewer Onboarding**: Use `!help` to show new viewers how to participate  
3. **Engagement Boost**: Announce game starts and celebrate victories
4. **Community Building**: Use leaderboards to create friendly competition
5. **Content Creation**: Games provide natural talking points and reactions

## 📝 License

MIT License - feel free to modify and distribute!

---

**Happy Streaming! 🎮✨**
