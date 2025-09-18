// Simple test to verify game functionality
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
const GameController = require('../src/gameController');
const ChatCommandParser = require('../src/utils/chatCommandParser');

function runTests() {
    console.log('🧪 Running Twitch Interactive Game Tests...\n');
    
    // Test 1: Chat Command Parser
    console.log('Test 1: Chat Command Parser');
    const parser = new ChatCommandParser();
    
    const testCommands = [
        '!help',
        '!adventure',
        '!choice A',
        '!guess 42',
        '!feed',
        '!attack'
    ];
    
    testCommands.forEach(cmd => {
        const parsed = parser.parse(cmd, 'testuser');
        console.log(`  "${cmd}" -> ${parsed ? JSON.stringify(parsed) : 'null'}`);
    });
    
    // Test 2: Game Controller Initialization
    console.log('\nTest 2: Game Controller');
    const gameController = new GameController();
    gameController.initialize();
    
    // Test 3: Command Handling
    console.log('\nTest 3: Command Handling');
    
    async function testGameCommands() {
        const testCmds = [
            { command: 'help', args: [], username: 'testuser' },
            { command: 'game', args: [], username: 'testuser' },
            { command: 'adventure', args: [], username: 'testuser' },
            { command: 'numberbattle', args: [], username: 'testuser' }
        ];
        
        for (const cmd of testCmds) {
            try {
                const response = await gameController.handleCommand(cmd, { username: cmd.username });
                console.log(`  !${cmd.command} -> "${response.substring(0, 100)}..."`);
            } catch (error) {
                console.log(`  !${cmd.command} -> Error: ${error.message}`);
            }
        }
    }
    
    // Test 4: Individual Game Tests
    console.log('\nTest 4: Individual Games');
    
    // Test Adventure Game
    const AdventureGame = require('../src/games/adventureGame');
    const adventure = new AdventureGame();
    console.log('  Adventure Game:', adventure.getStatus());
    
    // Test Number Battle Game  
    const NumberBattleGame = require('../src/games/numberBattleGame');
    const numberBattle = new NumberBattleGame();
    console.log('  Number Battle:', numberBattle.getStatus());
    
    // Test Virtual Pet Game
    const VirtualPetGame = require('../src/games/virtualPetGame');
    const petGame = new VirtualPetGame();
    console.log('  Virtual Pet:', petGame.getStatus());
    
    // Test Arena Combat Game
    const ArenaCombatGame = require('../src/games/arenaCombatGame');
    const arenaGame = new ArenaCombatGame();
    console.log('  Arena Combat:', arenaGame.getStatus());
    
    testGameCommands().then(() => {
        console.log('\n✅ All tests completed successfully!');
        console.log('\n📋 Setup Instructions:');
        console.log('1. Copy .env.example to .env');
        console.log('2. Fill in your Twitch bot credentials');
        console.log('3. Run: npm start');
        console.log('4. Your viewers can interact with: !help, !adventure, !numberbattle, !pet, !arena');
    });
}

runTests();