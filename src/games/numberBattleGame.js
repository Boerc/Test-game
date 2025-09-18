class NumberBattleGame {
    constructor() {
        this.name = "Number Battle";
        this.targetNumber = null;
        this.guesses = new Map();
        this.leaderboard = new Map();
        this.gameActive = false;
        this.round = 0;
        this.difficulty = 'normal';
        this.ranges = {
            easy: { min: 1, max: 50 },
            normal: { min: 1, max: 100 },
            hard: { min: 1, max: 500 }
        };
    }

    getInstructions() {
        return `Type !guess <number> to make a guess. !numberbattle to start new round. Difficulty: ${this.difficulty}`;
    }

    canHandleCommand(cmd) {
        return ['numberbattle', 'guess', 'number', 'difficulty', 'leaderboard'].includes(cmd);
    }

    async handleCommand(command, context) {
        const { command: cmd, args, username } = command;

        switch (cmd) {
            case 'numberbattle':
                return this.startNewRound();
            
            case 'guess':
                return this.handleGuess(username, args[0]);
            
            case 'number':
                return this.getGameInfo();
                
            case 'difficulty':
                return this.changeDifficulty(args[0]);
                
            case 'leaderboard':
                return this.showLeaderboard();
        }

        return null;
    }

    startNewRound() {
        this.round++;
        this.gameActive = true;
        this.guesses.clear();
        
        const range = this.ranges[this.difficulty];
        this.targetNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        
        return `🎯 Number Battle Round ${this.round} Started!
🎲 I'm thinking of a number between ${range.min} and ${range.max}
💡 Type !guess <number> to make your guess!
🏆 Closest guess wins points!`;
    }

    handleGuess(username, guessStr) {
        if (!this.gameActive) {
            return `@${username} No active round! Type !numberbattle to start one!`;
        }

        const guess = parseInt(guessStr);
        if (isNaN(guess)) {
            return `@${username} Please provide a valid number!`;
        }

        const range = this.ranges[this.difficulty];
        if (guess < range.min || guess > range.max) {
            return `@${username} Number must be between ${range.min} and ${range.max}!`;
        }

        // Prevent multiple guesses from same user in one round
        if (this.guesses.has(username)) {
            return `@${username} You already guessed ${this.guesses.get(username)} this round!`;
        }

        this.guesses.set(username, guess);
        
        // Check for exact match
        if (guess === this.targetNumber) {
            return this.endRound(username, true);
        }

        // Auto-end round after 10 guesses or 45 seconds
        if (this.guesses.size >= 10) {
            return this.endRound();
        }

        const diff = Math.abs(guess - this.targetNumber);
        let hint = "";
        
        if (diff <= 5) {
            hint = " 🔥 Very close!";
        } else if (diff <= 15) {
            hint = " 🌡️ Getting warm!";
        } else if (diff <= 30) {
            hint = " ❄️ Cool!";
        } else {
            hint = " 🧊 Ice cold!";
        }

        return `@${username} guessed ${guess}!${hint} (${this.guesses.size}/10 guesses)`;
    }

    endRound(exactWinner = null, isExact = false) {
        if (!this.gameActive) return null;
        
        this.gameActive = false;
        
        if (this.guesses.size === 0) {
            return "😴 No guesses this round! Type !numberbattle to try again!";
        }

        let winner;
        let winningGuess;
        let closestDiff = Infinity;

        if (exactWinner) {
            winner = exactWinner;
            winningGuess = this.targetNumber;
        } else {
            // Find closest guess
            for (const [user, guess] of this.guesses) {
                const diff = Math.abs(guess - this.targetNumber);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    winner = user;
                    winningGuess = guess;
                }
            }
        }

        // Award points
        const points = isExact ? 10 : Math.max(1, 10 - Math.floor(closestDiff / 5));
        const currentPoints = this.leaderboard.get(winner) || 0;
        this.leaderboard.set(winner, currentPoints + points);

        let result = `🎯 Round ${this.round} Results!\n`;
        result += `🔢 The number was: ${this.targetNumber}\n`;
        result += `🏆 Winner: ${winner} (guessed ${winningGuess}) +${points} points!\n`;
        
        if (!isExact && closestDiff > 0) {
            result += `📏 Distance: ${closestDiff}\n`;
        }
        
        result += `💫 ${winner} now has ${this.leaderboard.get(winner)} total points!`;

        return result;
    }

    changeDifficulty(newDifficulty) {
        if (!newDifficulty || !this.ranges[newDifficulty]) {
            return `🎚️ Available difficulties: easy (1-50), normal (1-100), hard (1-500). Current: ${this.difficulty}`;
        }

        this.difficulty = newDifficulty;
        return `🎚️ Difficulty changed to ${newDifficulty}! Range: ${this.ranges[newDifficulty].min}-${this.ranges[newDifficulty].max}`;
    }

    showLeaderboard() {
        if (this.leaderboard.size === 0) {
            return "🏆 Leaderboard is empty! Play some rounds to see scores!";
        }

        const sorted = [...this.leaderboard.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        let result = "🏆 Number Battle Leaderboard:\n";
        sorted.forEach(([username, points], index) => {
            const medal = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index];
            result += `${medal} ${username}: ${points} pts\n`;
        });

        return result;
    }

    getGameInfo() {
        if (this.gameActive) {
            const range = this.ranges[this.difficulty];
            return `🎯 Active round ${this.round}: Guess between ${range.min}-${range.max} (${this.guesses.size}/10 guesses)`;
        }
        return `🎲 Number Battle ready! Type !numberbattle to start. Difficulty: ${this.difficulty}`;
    }

    getStatus() {
        return `🎲 Number Battle: Round ${this.round}, Active: ${this.gameActive}, Players: ${this.leaderboard.size}`;
    }
}

module.exports = NumberBattleGame;