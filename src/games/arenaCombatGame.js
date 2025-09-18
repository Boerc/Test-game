class ArenaCombatGame {
    constructor() {
        this.name = "Arena Combat";
        this.battles = new Map();
        this.warriors = new Map();
        this.currentBattle = null;
        this.battleActive = false;
        this.actionVotes = new Map();
        this.votingTimer = null;
        this.round = 0;
        this.leaderboard = new Map();
    }

    getInstructions() {
        return `Epic battles await! !arena to start, then vote: !attack !defend !magic !special`;
    }

    canHandleCommand(cmd) {
        return ['arena', 'attack', 'defend', 'magic', 'special', 'battle', 'warriors', 'rank'].includes(cmd);
    }

    async handleCommand(command, context) {
        const { command: cmd, args, username } = command;

        switch (cmd) {
            case 'arena':
                return this.startBattle();
            
            case 'attack':
                return this.voteAction(username, 'attack');
            
            case 'defend':
                return this.voteAction(username, 'defend');
                
            case 'magic':
                return this.voteAction(username, 'magic');
                
            case 'special':
                return this.voteAction(username, 'special');
            
            case 'battle':
                return this.getBattleStatus();
                
            case 'warriors':
                return this.showWarriors();
                
            case 'rank':
                return this.showRanks();
        }

        return null;
    }

    startBattle() {
        if (this.battleActive) {
            return "⚔️ Battle already in progress! Vote for an action!";
        }

        this.round++;
        this.battleActive = true;
        this.actionVotes.clear();
        
        // Create random enemy
        const enemies = [
            { name: "Shadow Assassin", hp: 80, power: 25, emoji: "🥷" },
            { name: "Fire Dragon", hp: 120, power: 30, emoji: "🐉" },
            { name: "Ice Golem", hp: 100, power: 20, emoji: "❄️" },
            { name: "Lightning Wizard", hp: 70, power: 35, emoji: "⚡" },
            { name: "Stone Giant", hp: 150, power: 15, emoji: "🗿" },
            { name: "Void Demon", hp: 90, power: 28, emoji: "👹" }
        ];
        
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        
        this.currentBattle = {
            enemy: { ...enemy },
            hero: {
                name: "Chat Heroes",
                hp: 100,
                maxHp: 100,
                power: 20,
                mana: 50,
                shield: 0,
                emoji: "⚔️"
            },
            turn: 1
        };

        const message = `⚔️ Arena Combat Round ${this.round}!\n`;
        return message + this.displayBattleState() + this.startActionVoting();
    }

    voteAction(username, action) {
        if (!this.battleActive) {
            return `@${username} No battle active! Type !arena to start one!`;
        }

        const validActions = ['attack', 'defend', 'magic', 'special'];
        if (!validActions.includes(action)) {
            return `@${username} Invalid action! Choose: attack, defend, magic, special`;
        }

        this.actionVotes.set(username, action);
        
        return `@${username} voted for ${action}! (${this.actionVotes.size} votes)`;
    }

    startActionVoting() {
        this.actionVotes.clear();
        
        // Auto-resolve after 20 seconds
        if (this.votingTimer) {
            clearTimeout(this.votingTimer);
        }
        
        this.votingTimer = setTimeout(() => {
            this.resolveBattleTurn();
        }, 20000);

        return `\n🗳️ Vote for action: !attack !defend !magic !special (20 seconds)`;
    }

    resolveBattleTurn() {
        if (!this.battleActive) return null;

        // Count votes
        const voteCount = { attack: 0, defend: 0, magic: 0, special: 0 };
        for (const vote of this.actionVotes.values()) {
            voteCount[vote]++;
        }

        // Determine winning action
        const winningAction = Object.keys(voteCount).reduce((a, b) => 
            voteCount[a] > voteCount[b] ? a : b
        );

        // Apply hero action
        const heroResult = this.executeHeroAction(winningAction);
        const enemyResult = this.executeEnemyAction();
        
        let result = `⚔️ Turn ${this.currentBattle.turn} Results:\n`;
        result += `🗳️ Chosen Action: ${winningAction} (${voteCount[winningAction]} votes)\n`;
        result += heroResult + '\n' + enemyResult + '\n';
        
        // Check battle end conditions
        if (this.currentBattle.hero.hp <= 0) {
            result += this.endBattle(false);
        } else if (this.currentBattle.enemy.hp <= 0) {
            result += this.endBattle(true);
        } else {
            this.currentBattle.turn++;
            result += this.displayBattleState();
            setTimeout(() => this.startActionVoting(), 3000);
        }

        return result;
    }

    executeHeroAction(action) {
        const battle = this.currentBattle;
        let damage = 0;
        let result = "";

        switch (action) {
            case 'attack':
                damage = battle.hero.power + Math.floor(Math.random() * 15);
                battle.enemy.hp -= damage;
                result = `⚔️ Heroes attack for ${damage} damage!`;
                break;
                
            case 'defend':
                battle.hero.shield = 15;
                const heal = Math.floor(Math.random() * 10) + 5;
                battle.hero.hp = Math.min(battle.hero.maxHp, battle.hero.hp + heal);
                result = `🛡️ Heroes defend (+${battle.hero.shield} shield, +${heal} HP)`;
                break;
                
            case 'magic':
                if (battle.hero.mana >= 20) {
                    damage = 30 + Math.floor(Math.random() * 20);
                    battle.enemy.hp -= damage;
                    battle.hero.mana -= 20;
                    result = `✨ Heroes cast magic for ${damage} damage! (-20 mana)`;
                } else {
                    damage = 10;
                    battle.enemy.hp -= damage;
                    result = `✨ Low mana! Weak magic attack for ${damage} damage`;
                }
                break;
                
            case 'special':
                const specials = [
                    { name: "Meteor Strike", damage: 45, cost: 30 },
                    { name: "Lightning Bolt", damage: 35, cost: 25 },
                    { name: "Holy Smite", damage: 40, cost: 35 }
                ];
                
                const special = specials[Math.floor(Math.random() * specials.length)];
                
                if (battle.hero.mana >= special.cost) {
                    battle.enemy.hp -= special.damage;
                    battle.hero.mana -= special.cost;
                    result = `💥 ${special.name} deals ${special.damage} damage! (-${special.cost} mana)`;
                } else {
                    damage = 15;
                    battle.enemy.hp -= damage;
                    result = `💥 Not enough mana for special! Basic attack for ${damage} damage`;
                }
                break;
        }

        // Restore some mana each turn
        battle.hero.mana = Math.min(50, battle.hero.mana + 5);
        
        return result;
    }

    executeEnemyAction() {
        const battle = this.currentBattle;
        const actions = ['attack', 'power_attack', 'special_ability'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        let damage = 0;
        let result = "";

        switch (action) {
            case 'attack':
                damage = battle.enemy.power + Math.floor(Math.random() * 10);
                damage = Math.max(0, damage - battle.hero.shield);
                battle.hero.hp -= damage;
                result = `${battle.enemy.emoji} ${battle.enemy.name} attacks for ${damage} damage!`;
                break;
                
            case 'power_attack':
                damage = battle.enemy.power * 1.5 + Math.floor(Math.random() * 15);
                damage = Math.max(0, damage - battle.hero.shield);
                battle.hero.hp -= damage;
                result = `${battle.enemy.emoji} ${battle.enemy.name} uses a powerful attack for ${damage} damage!`;
                break;
                
            case 'special_ability':
                const abilities = {
                    "🥷": "Shadow Strike",
                    "🐉": "Fire Breath", 
                    "❄️": "Ice Shard",
                    "⚡": "Lightning Storm",
                    "🗿": "Boulder Throw",
                    "👹": "Void Blast"
                };
                
                const abilityName = abilities[battle.enemy.emoji] || "Special Attack";
                damage = battle.enemy.power + 20;
                damage = Math.max(0, damage - battle.hero.shield);
                battle.hero.hp -= damage;
                result = `${battle.enemy.emoji} ${battle.enemy.name} uses ${abilityName} for ${damage} damage!`;
                break;
        }

        battle.hero.shield = Math.max(0, battle.hero.shield - 5);
        
        return result;
    }

    endBattle(victory) {
        this.battleActive = false;
        clearTimeout(this.votingTimer);
        
        let result = "";
        
        if (victory) {
            const exp = 50 + Math.floor(Math.random() * 30);
            result = `🎉 VICTORY! ${this.currentBattle.enemy.name} defeated!\n`;
            result += `⭐ Everyone gains ${exp} experience!`;
            
            // Award points to all participants
            for (const username of this.actionVotes.keys()) {
                const currentScore = this.leaderboard.get(username) || 0;
                this.leaderboard.set(username, currentScore + exp);
            }
        } else {
            result = `💀 DEFEAT! The heroes have fallen to ${this.currentBattle.enemy.name}...\n`;
            result += `🎯 Better luck next time! Type !arena to try again!`;
        }
        
        this.currentBattle = null;
        return result;
    }

    displayBattleState() {
        const battle = this.currentBattle;
        
        let display = `\n📊 Battle Status:\n`;
        display += `${battle.hero.emoji} Heroes: ${battle.hero.hp}/${battle.hero.maxHp} HP, ${battle.hero.mana}/50 MP`;
        if (battle.hero.shield > 0) display += `, ${battle.hero.shield} shield`;
        display += `\n${battle.enemy.emoji} ${battle.enemy.name}: ${Math.max(0, battle.enemy.hp)} HP\n`;
        
        return display;
    }

    getBattleStatus() {
        if (!this.battleActive) {
            return "⚔️ No active battle. Type !arena to start one!";
        }
        
        return `⚔️ Battle Round ${this.round}, Turn ${this.currentBattle.turn}` + this.displayBattleState();
    }

    showWarriors() {
        if (this.actionVotes.size === 0) {
            return "⚔️ No active warriors! Join a battle to become one!";
        }
        
        let result = "⚔️ Current Battle Warriors:\n";
        for (const [username, action] of this.actionVotes) {
            result += `🗡️ ${username} (voted ${action})\n`;
        }
        
        return result;
    }

    showRanks() {
        if (this.leaderboard.size === 0) {
            return "🏆 No rankings yet! Fight in the arena to earn experience!";
        }

        const sorted = [...this.leaderboard.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        let result = "🏆 Arena Rankings:\n";
        sorted.forEach(([username, exp], index) => {
            const rank = ['👑', '🥇', '🥈', '🥉', '🏅'][index] || '🏅';
            result += `${rank} ${username}: ${exp} EXP\n`;
        });

        return result;
    }

    getStatus() {
        return `⚔️ Arena Combat: Round ${this.round}, Active: ${this.battleActive}, Warriors: ${this.leaderboard.size}`;
    }
}

module.exports = ArenaCombatGame;