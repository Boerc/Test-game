const AdventureGame = require('./games/adventureGame');
const NumberBattleGame = require('./games/numberBattleGame');
const VirtualPetGame = require('./games/virtualPetGame');
const ArenaCombatGame = require('./games/arenaCombatGame');

class GameController {
    constructor() {
        this.games = {
            adventure: new AdventureGame(),
            numberbattle: new NumberBattleGame(), 
            pet: new VirtualPetGame(),
            arena: new ArenaCombatGame()
        };
        
        this.currentGame = null;
        this.isGameActive = false;
    }

    initialize() {
        console.log('🎯 Game Controller initialized with 4 interactive games:');
        console.log('  - Adventure Quest (!adventure)');
        console.log('  - Number Battle (!numberbattle)');
        console.log('  - Virtual Pet (!pet)');
        console.log('  - Arena Combat (!arena)');
        console.log('Type !help for available commands');
    }

    async handleCommand(command, context) {
        const { command: cmd, args, username } = command;

        // Global commands
        switch (cmd) {
            case 'help':
                return this.getHelpMessage();
            
            case 'game':
                return this.getGameStatus();
            
            case 'status':
                return this.getDetailedStatus();
        }

        // Game selection commands
        if (this.games[cmd]) {
            this.currentGame = this.games[cmd];
            this.isGameActive = true;
            return `🎮 Starting ${this.currentGame.name}! ${this.currentGame.getInstructions()}`;
        }

        // Delegate to current game if active
        if (this.isGameActive && this.currentGame) {
            return await this.currentGame.handleCommand(command, context);
        }

        // Handle game-specific commands that can work across games
        for (const game of Object.values(this.games)) {
            if (game.canHandleCommand(cmd)) {
                const response = await game.handleCommand(command, context);
                if (response) return response;
            }
        }

        return `❓ Unknown command '${cmd}'. Type !help for available commands.`;
    }

    getHelpMessage() {
        return `🎮 Twitch Interactive Games Help:
📚 Available Games: !adventure !numberbattle !pet !arena
🔧 General: !help !game !status
💡 Start any game to see specific commands!`;
    }

    getGameStatus() {
        if (this.isGameActive && this.currentGame) {
            return `🎯 Currently playing: ${this.currentGame.name}`;
        }
        return `🎮 No active game. Available: !adventure !numberbattle !pet !arena`;
    }

    getDetailedStatus() {
        let status = '📊 Game System Status:\n';
        
        for (const [key, game] of Object.entries(this.games)) {
            status += `${game.getStatus()}\n`;
        }
        
        if (this.currentGame) {
            status += `\n🎯 Active: ${this.currentGame.name}`;
        }
        
        return status;
    }
}

module.exports = GameController;