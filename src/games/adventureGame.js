class AdventureGame {
    constructor() {
        this.name = "Adventure Quest";
        this.currentScene = 0;
        this.votes = new Map();
        this.votingActive = false;
        this.votingTimer = null;
        this.players = new Set();
        
        this.story = [
            {
                text: "🏰 You stand before an ancient castle. Dark clouds gather above.",
                choices: {
                    A: "Enter through the main gate",
                    B: "Sneak around to find a side entrance", 
                    C: "Climb the ivy-covered wall"
                }
            },
            {
                text: "🌙 Inside, you hear mysterious whispers echoing through the halls.",
                choices: {
                    A: "Follow the whispers deeper into the castle",
                    B: "Search the nearby rooms for clues",
                    C: "Call out to identify the source"
                }
            },
            {
                text: "⚔️ A shadowy figure blocks your path, wielding a glowing sword!",
                choices: {
                    A: "Draw your weapon and fight",
                    B: "Try to negotiate with the figure",
                    C: "Attempt to sneak past quietly"
                }
            }
        ];
    }

    getInstructions() {
        return `Type !choice A/B/C to vote on story decisions. Current scene: ${this.currentScene + 1}/${this.story.length}`;
    }

    canHandleCommand(cmd) {
        return ['adventure', 'choice', 'story'].includes(cmd);
    }

    async handleCommand(command, context) {
        const { command: cmd, args, username } = command;

        switch (cmd) {
            case 'adventure':
                return this.startAdventure();
            
            case 'choice':
                return this.handleVote(username, args[0]);
            
            case 'story':
                return this.getCurrentScene();
        }

        return null;
    }

    startAdventure() {
        this.currentScene = 0;
        this.votes.clear();
        this.players.clear();
        return this.getCurrentScene() + "\n" + this.startVoting();
    }

    getCurrentScene() {
        if (this.currentScene >= this.story.length) {
            return "🎉 Adventure Complete! Thanks for playing! Type !adventure to restart.";
        }

        const scene = this.story[this.currentScene];
        let message = `📖 Scene ${this.currentScene + 1}: ${scene.text}\n`;
        message += "🗳️ Vote for your choice:\n";
        
        for (const [letter, choice] of Object.entries(scene.choices)) {
            message += `${letter}: ${choice}\n`;
        }
        
        return message;
    }

    startVoting() {
        this.votingActive = true;
        this.votes.clear();
        
        // Auto-advance after 30 seconds
        if (this.votingTimer) {
            clearTimeout(this.votingTimer);
        }
        
        this.votingTimer = setTimeout(() => {
            this.resolveVoting();
        }, 30000);

        return "⏰ Voting started! You have 30 seconds to choose.";
    }

    handleVote(username, choice) {
        if (!this.votingActive) {
            return `@${username} No active voting right now. Type !adventure to start!`;
        }

        if (!choice || !['A', 'B', 'C'].includes(choice.toUpperCase())) {
            return `@${username} Please vote A, B, or C!`;
        }

        const normalizedChoice = choice.toUpperCase();
        this.votes.set(username, normalizedChoice);
        this.players.add(username);

        return `@${username} voted ${normalizedChoice}! Total votes: ${this.votes.size}`;
    }

    resolveVoting() {
        if (!this.votingActive) return null;
        
        this.votingActive = false;
        clearTimeout(this.votingTimer);

        if (this.votes.size === 0) {
            return "😴 No votes received. Type !adventure to try again!";
        }

        // Count votes
        const voteCount = { A: 0, B: 0, C: 0 };
        for (const vote of this.votes.values()) {
            voteCount[vote]++;
        }

        // Find winner
        const winner = Object.keys(voteCount).reduce((a, b) => 
            voteCount[a] > voteCount[b] ? a : b
        );

        const scene = this.story[this.currentScene];
        const chosenAction = scene.choices[winner];

        this.currentScene++;
        
        let result = `🎯 Voting Results: ${winner} wins! (A:${voteCount.A} B:${voteCount.B} C:${voteCount.C})\n`;
        result += `✨ You chose: ${chosenAction}\n`;
        
        if (this.currentScene < this.story.length) {
            result += "\n" + this.getCurrentScene();
            setTimeout(() => this.startVoting(), 2000);
        } else {
            result += "\n🎉 Adventure Complete! Type !adventure to play again!";
        }

        return result;
    }

    getStatus() {
        return `🏰 Adventure Quest: Scene ${this.currentScene + 1}/${this.story.length}, Players: ${this.players.size}`;
    }
}

module.exports = AdventureGame;