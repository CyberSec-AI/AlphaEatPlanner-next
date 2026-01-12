const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log("Checking DB connection...");
    try {
        // Connect specifically
        await prisma.$connect();
        console.log("Connected to database successfully.");

        const username = 'admin';
        const password = 'admin'; // You can change this or pass via env
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Upserting user: ${username}...`);

        const user = await prisma.user.upsert({
            where: { username: username },
            update: {
                hashedPassword: hashedPassword
            },
            create: {
                username: username,
                hashedPassword: hashedPassword,
                fullName: 'Administrator',
                // Optional: Add a default admin profile pic or other fields
            },
        });

        console.log("User 'admin' with password 'admin' is ready.");
        console.log(`User ID: ${user.id}`);

    } catch (error) {
        console.error("Error connecting or seeding database:", error);
        process.exit(1);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
