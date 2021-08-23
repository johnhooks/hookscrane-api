const readline = require("readline");
const bcrypt = require("bcrypt");
const { PrismaClient, Role } = require("@prisma/client");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prisma = new PrismaClient({
  log: ["query", `warn`, `error`],
});

rl.question("What is the new user's email address? ", function (email) {
  rl.question("What is the new user's password? ", function (password) {
    const passwordDigest = bcrypt.hashSync(password, 10);
    prisma.user
      .create({
        data: {
          email,
          passwordDigest,
          roles: [Role.ADMIN],
        },
      })
      .then(result => {
        console.log(`New user ${result.email} created`);
        rl.close();
      })
      .catch(error => {
        console.log(error.message);
        rl.close();
      });
  });
});

rl.on("close", function () {
  prisma.$disconnect().then(() => {
    console.log("bye");
    process.exit(0);
  });
});
