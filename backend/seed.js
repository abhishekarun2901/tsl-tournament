import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Team, Player, Match, Standing } from './models/index.js';

dotenv.config();

const teamsData = [
    // Pool A
    {
        name: 'Liverpool FC',
        manager: 'Amal Sidhan',
        captain: 'Afreen',
        pool: 'A',
        logo: '',
        players: [
            { name: 'Karthik Krishna U', department: 'ME' },
            { name: 'Shihan', department: 'ME' },
            { name: 'Ben Jude Tharsiuse', department: 'ME' },
            { name: 'Muhammad Rashid', department: 'EC' },
            { name: 'Aswin Raj K', department: 'ME' },
            { name: 'Rameel', department: 'ME' },
            { name: 'Anand', department: 'ME' }
        ]
    },
    {
        name: 'Inter Milan',
        manager: 'Sarang',
        captain: 'Harisankar',
        pool: 'A',
        logo: '',
        players: [
            { name: 'Sreekuttan', department: 'ME' },
            { name: 'Rejith R', department: 'EE' },
            { name: 'Sanjay S', department: 'ME' },
            { name: 'Anandhu', department: 'ME' },
            { name: 'Shamil A', department: 'CSE' },
            { name: 'Niranjan Ravi', department: 'ME' },
            { name: 'Muhammed Anas', department: 'EC' }
        ]
    },
    {
        name: 'Fiorentina',
        manager: 'Abdul Majeed',
        captain: 'Habeen',
        pool: 'A',
        logo: '',
        players: [
            { name: 'S Amrudhesh', department: 'IC' },
            { name: 'Adithyan VP', department: 'EC' },
            { name: 'Sidharth M Pillai', department: 'EC' },
            { name: 'Harinandan', department: 'ME' },
            { name: 'Sanjay A S', department: 'ME' },
            { name: 'Sebil Anto T', department: 'CE' },
            { name: 'Harikrishna R', department: 'ME' }
        ]
    },
    {
        name: 'Lazio',
        manager: 'Sanin',
        captain: 'Dhayanand',
        pool: 'A',
        logo: '',
        players: [
            { name: 'Harikrishna R', department: 'ME' },
            { name: 'Rajeeb', department: 'CE' },
            { name: 'Akash Vijayan', department: 'ME' },
            { name: 'Adith Krishna', department: 'EC' },
            { name: 'Anand Krishna', department: 'CE' },
            { name: 'Amith Aravind', department: 'ME' },
            { name: 'Sreeraj', department: 'ME' }
        ]
    },
    // Pool B
    {
        name: 'Arsenal',
        manager: 'Jithin B',
        captain: 'Amal',
        pool: 'B',
        logo: '',
        players: [
            { name: 'Sreekuttan', department: 'ME' },
            { name: 'Rameel', department: 'ME' },
            { name: 'Darren Thomas', department: 'ME' },
            { name: 'Jasir Abid', department: 'EE' },
            { name: 'Amal Sugathan', department: 'ME' },
            { name: 'Shamil A', department: 'CSE' },
            { name: 'Christo', department: 'ME' }
        ]
    },
    {
        name: 'Força FC',
        manager: 'Arun Vellodan',
        captain: 'Arun Prakash',
        pool: 'B',
        logo: '',
        players: [
            { name: 'Abhishek MS', department: 'CSE' },
            { name: 'Nayanjith', department: 'CSE' },
            { name: 'Chithu', department: 'IC' },
            { name: 'Abhinand C', department: 'CSE' },
            { name: 'Noel Tom Santhosh', department: 'CSE' },
            { name: 'Sabari R Nadh', department: 'CSE' },
            { name: 'Harikrishnan A', department: 'CSE' }
        ]
    },
    {
        name: 'São Paulo FC',
        manager: 'Akash',
        captain: 'Sriram',
        pool: 'B',
        logo: '',
        players: [
            { name: 'Abhinav R', department: 'EC' },
            { name: 'Rishikesh Unnikrishnan', department: 'EC' },
            { name: 'Anand', department: 'ME' },
            { name: 'Muhammad Rashid', department: 'EC' },
            { name: 'K Vishnu', department: 'IC' },
            { name: 'Ahammed Najjad', department: 'ME' },
            { name: 'Aswin Raj K', department: 'ME' }
        ]
    },
    {
        name: 'AS Monaco',
        manager: 'Shyam',
        captain: 'Vishnu',
        pool: 'B',
        logo: '',
        players: [
            { name: 'Abay P', department: 'EE' },
            { name: 'Viswajith K B', department: 'IC' },
            { name: 'Mashur Pul', department: 'CE' },
            { name: 'Sreejith', department: 'EE' },
            { name: 'Arshak Ali', department: 'EE' },
            { name: 'Anshad A', department: 'IC' },
            { name: 'Sujin S', department: 'ME' }
        ]
    }
];

// Day 1 fixtures - 9 matches, starting at 6:45 PM, 15 min each
const fixturesData = [
    { teamA: 'Liverpool FC', teamB: 'Lazio', matchNumber: 1 },
    { teamA: 'Inter Milan', teamB: 'Fiorentina', matchNumber: 2 },
    { teamA: 'Arsenal', teamB: 'Força FC', matchNumber: 3 },
    { teamA: 'AS Monaco', teamB: 'São Paulo FC', matchNumber: 4 },
    { teamA: 'Liverpool FC', teamB: 'Fiorentina', matchNumber: 5 },
    { teamA: 'Inter Milan', teamB: 'Lazio', matchNumber: 6 },
    { teamA: 'Arsenal', teamB: 'São Paulo FC', matchNumber: 7 },
    { teamA: 'Força FC', teamB: 'AS Monaco', matchNumber: 8 },
    { teamA: 'Liverpool FC', teamB: 'Inter Milan', matchNumber: 9 }
];

async function seed() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Team.deleteMany({});
        await Player.deleteMany({});
        await Match.deleteMany({});
        await Standing.deleteMany({});
        console.log('✅ Data cleared');

        // Create teams and players
        console.log('📝 Creating teams and players...');
        const teamMap = {};

        for (const teamData of teamsData) {
            const team = new Team({
                name: teamData.name,
                manager: teamData.manager,
                captain: teamData.captain,
                pool: teamData.pool,
                logo: teamData.logo
            });
            await team.save();
            teamMap[teamData.name] = team._id;

            // Create players for this team
            for (let i = 0; i < teamData.players.length; i++) {
                const playerData = teamData.players[i];
                const player = new Player({
                    name: playerData.name,
                    teamId: team._id,
                    department: playerData.department,
                    jerseyNumber: i + 1,
                    goals: 0
                });
                await player.save();
            }

            // Create standing for this team
            const standing = new Standing({
                teamId: team._id,
                played: 0,
                won: 0,
                draw: 0,
                lost: 0,
                gf: 0,
                ga: 0,
                gd: 0,
                points: 0
            });
            await standing.save();

            console.log(`  ✅ Created team: ${team.name}`);
        }

        // Create fixtures - Day 1 matches
        // Match starts at 6:45 PM (18:45), 15 min intervals
        // Tournament date is 2 days from now
        console.log('📅 Creating fixtures (Day 1)...');

        const matchDate = new Date();
        matchDate.setDate(matchDate.getDate() + 2); // 2 days from now
        matchDate.setHours(18, 45, 0, 0); // Start at 6:45 PM

        for (let i = 0; i < fixturesData.length; i++) {
            const fixtureData = fixturesData[i];
            const matchTime = new Date(matchDate);
            matchTime.setMinutes(matchTime.getMinutes() + (i * 15)); // 15 min intervals

            const match = new Match({
                teamA: teamMap[fixtureData.teamA],
                teamB: teamMap[fixtureData.teamB],
                scoreA: 0,
                scoreB: 0,
                status: 'upcoming',
                matchTime: matchTime,
                matchday: 1,
                matchNumber: fixtureData.matchNumber,
                goalscorers: [],
                cards: []
            });
            await match.save();
            console.log(`  ✅ Match ${fixtureData.matchNumber}: ${fixtureData.teamA} vs ${fixtureData.teamB} at ${matchTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
        }

        console.log('\n🎉 Seeding completed successfully!');
        console.log(`   Teams: ${teamsData.length}`);
        console.log(`   Players: ${teamsData.reduce((acc, t) => acc + t.players.length, 0)}`);
        console.log(`   Day 1 Fixtures: ${fixturesData.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
