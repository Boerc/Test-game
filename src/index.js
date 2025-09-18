const tmi = require('tmi.js');
require('dotenv').config();

const GameController = require('./gameController');
const ChatCommandParser = require('./utils/chatCommandParser');

class TwitchInteractiveGame {
    constructor() {
        this.client = null;
        this.gameController = new GameController();
        this.commandParser = new ChatCommandParser();
        this.isConnected = false;
        
        this.setupTwitchClient();
    }

    setupTwitchClient() {
        const opts = {
            identity: {
                username: process.env.TWITCH_USERNAME,
                password: process.env.TWITCH_OAUTH_TOKEN
            },
            channels: [process.env.TWITCH_CHANNEL]
        };

        this.client = new tmi.client(opts);
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('message', this.onMessageHandler.bind(this));
        this.client.on('connected', this.onConnectedHandler.bind(this));
        this.client.on('disconnected', this.onDisconnectedHandler.bind(this));
    }

    async onMessageHandler(target, context, msg, self) {
        if (self) return; // Ignore bot's own messages

        const command = this.commandParser.parse(msg, context.username);
        
        if (command) {
            try {
                const response = await this.gameController.handleCommand(command, context);
                if (response) {
                    this.sendMessage(target, response);
                }
            } catch (error) {
                console.error('Error handling command:', error);
                this.sendMessage(target, `@${context.username} Oops! Something went wrong processing your command.`);
            }
        }
    }

    onConnectedHandler(addr, port) {
        console.log(`🎮 Twitch Interactive Game Bot connected to ${addr}:${port}`);
        this.isConnected = true;
        this.gameController.initialize();
    }

    onDisconnectedHandler(reason) {
        console.log(`Disconnected: ${reason}`);
        this.isConnected = false;
    }

    sendMessage(target, message) {
        if (this.isConnected) {
            this.client.say(target, message);
        }
    }

    async start() {
        try {
            await this.client.connect();
            console.log('🚀 Twitch Interactive Game System started!');
        } catch (error) {
            console.error('Failed to connect to Twitch:', error);
        }
    }

    stop() {
        if (this.client) {
            this.client.disconnect();
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

// Start the bot if this file is run directly
if (require.main === module) {
    const game = new TwitchInteractiveGame();
    game.start();
}

module.exports = TwitchInteractiveGame;