class VirtualPetGame {
    constructor() {
        this.name = "Virtual Pet Sanctuary";
        this.pets = new Map();
        this.globalPet = {
            name: "Twitch",
            type: "🐱",
            happiness: 50,
            hunger: 50,
            energy: 50,
            level: 1,
            experience: 0,
            lastFed: null,
            lastPlayed: null,
            lastSlept: null
        };
        this.caregivers = new Set();
        this.activities = ['play', 'feed', 'sleep', 'pet', 'treat'];
        this.petTypes = ['🐱', '🐶', '🐰', '🐸', '🐹'];
        
        // Start periodic pet status updates
        this.startPetCare();
    }

    getInstructions() {
        return `Care for ${this.globalPet.name}! Commands: !feed !play !sleep !pet !treat !status`;
    }

    canHandleCommand(cmd) {
        return ['pet', 'feed', 'play', 'sleep', 'treat', 'status', 'adopt', 'care'].includes(cmd);
    }

    async handleCommand(command, context) {
        const { command: cmd, args, username } = command;

        switch (cmd) {
            case 'pet':
                if (args.length === 0) return this.getPetStatus();
                return this.petAction(username);
            
            case 'feed':
                return this.feedPet(username);
            
            case 'play':
                return this.playWithPet(username);
            
            case 'sleep':
                return this.putPetToSleep(username);
                
            case 'treat':
                return this.giveTreat(username);
            
            case 'status':
                return this.getPetStatus();
                
            case 'adopt':
                return this.adoptPet(username, args[0]);
                
            case 'care':
                return this.getCareInstructions();
        }

        return null;
    }

    feedPet(username) {
        const now = Date.now();
        const timeSinceLastFed = this.globalPet.lastFed ? now - this.globalPet.lastFed : Infinity;
        
        if (timeSinceLastFed < 60000) { // 1 minute cooldown
            return `@${username} ${this.globalPet.name} is still full! Wait a bit before feeding again.`;
        }

        this.globalPet.hunger = Math.max(0, this.globalPet.hunger - 20);
        this.globalPet.happiness = Math.min(100, this.globalPet.happiness + 10);
        this.globalPet.lastFed = now;
        this.caregivers.add(username);
        
        this.addExperience(5);
        
        const foods = ['🥫 cat food', '🥩 treats', '🐟 tuna', '🥛 milk', '🍖 premium meal'];
        const food = foods[Math.floor(Math.random() * foods.length)];
        
        return `@${username} fed ${this.globalPet.name} some ${food}! ${this.globalPet.type} Hunger: ${this.globalPet.hunger}% (-20) Happiness: ${this.globalPet.happiness}% (+10)`;
    }

    playWithPet(username) {
        const now = Date.now();
        const timeSinceLastPlayed = this.globalPet.lastPlayed ? now - this.globalPet.lastPlayed : Infinity;
        
        if (timeSinceLastPlayed < 45000) { // 45 second cooldown
            return `@${username} ${this.globalPet.name} is still tired from playing! Let them rest.`;
        }

        this.globalPet.energy = Math.max(0, this.globalPet.energy - 15);
        this.globalPet.happiness = Math.min(100, this.globalPet.happiness + 25);
        this.globalPet.lastPlayed = now;
        this.caregivers.add(username);
        
        this.addExperience(8);
        
        const games = ['🎾 fetch', '🧶 yarn ball', '🪶 feather toy', '🎪 tricks', '🏃 running'];
        const game = games[Math.floor(Math.random() * games.length)];
        
        return `@${username} played ${game} with ${this.globalPet.name}! ${this.globalPet.type} Energy: ${this.globalPet.energy}% (-15) Happiness: ${this.globalPet.happiness}% (+25)`;
    }

    putPetToSleep(username) {
        const now = Date.now();
        const timeSinceLastSlept = this.globalPet.lastSlept ? now - this.globalPet.lastSlept : Infinity;
        
        if (timeSinceLastSlept < 120000) { // 2 minute cooldown
            return `@${username} ${this.globalPet.name} isn't sleepy yet! They just woke up.`;
        }

        this.globalPet.energy = Math.min(100, this.globalPet.energy + 30);
        this.globalPet.happiness = Math.min(100, this.globalPet.happiness + 5);
        this.globalPet.lastSlept = now;
        this.caregivers.add(username);
        
        this.addExperience(3);
        
        return `@${username} tucked ${this.globalPet.name} in for a nap! ${this.globalPet.type} 😴 Energy: ${this.globalPet.energy}% (+30) Happiness: ${this.globalPet.happiness}% (+5)`;
    }

    petAction(username) {
        this.globalPet.happiness = Math.min(100, this.globalPet.happiness + 15);
        this.caregivers.add(username);
        this.addExperience(2);
        
        const reactions = ['purrs contentedly', 'nuzzles your hand', 'wags tail happily', 'gives you a gentle headbutt', 'rolls over for belly rubs'];
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        return `@${username} gently pets ${this.globalPet.name}! ${this.globalPet.type} ${reaction} ❤️ Happiness: ${this.globalPet.happiness}% (+15)`;
    }

    giveTreat(username) {
        this.globalPet.happiness = Math.min(100, this.globalPet.happiness + 20);
        this.globalPet.hunger = Math.max(0, this.globalPet.hunger - 10);
        this.caregivers.add(username);
        this.addExperience(6);
        
        const treats = ['🍪 special cookie', '🦴 bone', '🐟 salmon treat', '🥓 bacon bit', '🧀 cheese cube'];
        const treat = treats[Math.floor(Math.random() * treats.length)];
        
        return `@${username} gave ${this.globalPet.name} a ${treat}! ${this.globalPet.type} ✨ Happiness: ${this.globalPet.happiness}% (+20)`;
    }

    adoptPet(username, petName) {
        if (!petName) {
            return `@${username} Specify a name! Example: !adopt Fluffy`;
        }

        if (petName.length > 12) {
            return `@${username} Pet name too long! Keep it under 12 characters.`;
        }

        const newType = this.petTypes[Math.floor(Math.random() * this.petTypes.length)];
        this.globalPet.name = petName;
        this.globalPet.type = newType;
        this.globalPet.happiness = 70;
        this.globalPet.hunger = 40;
        this.globalPet.energy = 60;
        this.globalPet.level = 1;
        this.globalPet.experience = 0;
        
        return `@${username} adopted a new pet! Meet ${petName} the ${newType}! Everyone can help care for them!`;
    }

    addExperience(amount) {
        this.globalPet.experience += amount;
        const expNeeded = this.globalPet.level * 50;
        
        if (this.globalPet.experience >= expNeeded) {
            this.globalPet.level++;
            this.globalPet.experience = 0;
            return true; // Level up occurred
        }
        return false;
    }

    getPetStatus() {
        const pet = this.globalPet;
        const expNeeded = pet.level * 50;
        const healthStatus = this.getHealthStatus();
        
        let status = `🐾 ${pet.name} the ${pet.type} (Level ${pet.level})\n`;
        status += `💖 Happiness: ${pet.happiness}% ${this.getStatusBar(pet.happiness)}\n`;
        status += `🍽️ Hunger: ${pet.hunger}% ${this.getStatusBar(100 - pet.hunger)}\n`;
        status += `⚡ Energy: ${pet.energy}% ${this.getStatusBar(pet.energy)}\n`;
        status += `⭐ Experience: ${pet.experience}/${expNeeded}\n`;
        status += `👥 Caregivers: ${this.caregivers.size}\n`;
        status += `🏥 Status: ${healthStatus}`;
        
        return status;
    }

    getHealthStatus() {
        const avg = (this.globalPet.happiness + (100 - this.globalPet.hunger) + this.globalPet.energy) / 3;
        
        if (avg >= 80) return "😄 Excellent!";
        if (avg >= 60) return "😊 Good";
        if (avg >= 40) return "😐 Okay";
        if (avg >= 20) return "😟 Needs attention";
        return "😢 Critical - needs lots of care!";
    }

    getStatusBar(value) {
        const filled = Math.floor(value / 10);
        const empty = 10 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }

    getCareInstructions() {
        return `🐾 Pet Care Guide:
!feed - Give food (reduces hunger)
!play - Play games (increases happiness, uses energy)
!sleep - Rest time (restores energy)
!pet - Show affection (increases happiness)
!treat - Special snacks (happiness boost)
!status - Check pet condition
!adopt <name> - Adopt a new pet`;
    }

    startPetCare() {
        // Slowly decrease stats over time to encourage interaction
        setInterval(() => {
            this.globalPet.hunger = Math.min(100, this.globalPet.hunger + 2);
            this.globalPet.happiness = Math.max(0, this.globalPet.happiness - 1);
            this.globalPet.energy = Math.max(0, this.globalPet.energy - 1);
        }, 60000); // Every minute
    }

    getStatus() {
        return `🐾 Virtual Pet: ${this.globalPet.name} Lv.${this.globalPet.level}, Caregivers: ${this.caregivers.size}`;
    }
}

module.exports = VirtualPetGame;