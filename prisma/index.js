const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.$connect().then(() => {
  console.log("Connected to database");
});

module.exports = prisma;
