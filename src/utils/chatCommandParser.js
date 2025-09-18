class ChatCommandParser {
    constructor() {
        this.prefix = process.env.COMMAND_PREFIX || '!';
    }

    parse(message, username) {
        const trimmed = message.trim();
        
        if (!trimmed.startsWith(this.prefix)) {
            return null;
        }

        const parts = trimmed.slice(1).split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        return {
            command,
            args,
            username,
            fullMessage: message
        };
    }

    isValidCommand(command) {
        const validCommands = [
            'game', 'help', 'status',
            'adventure', 'choice', 'story',
            'guess', 'number', 'battle',
            'pet', 'feed', 'play', 'care',
            'arena', 'attack', 'defend', 'magic'
        ];
        
        return validCommands.includes(command);
    }
}

module.exports = ChatCommandParser;