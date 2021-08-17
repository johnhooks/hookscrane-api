const path = require("path");
// const glob = require("glob");
const { build } = require("esbuild");

build({
  entryPoints: [path.resolve(__dirname, "../main.ts")],
  bundle: true,
  // write: false,
  outdir: path.resolve(__dirname, "../build"),
  platform: "node",
  format: "cjs",
  sourcemap: "inline",
  external: [
    "@prisma/client",
    "bcrypt",
    "cookie",
    "date-fns",
    "fastify",
    "fastify-plugin",
    "graphql",
    "graphql-scalars",
    "ioredis",
    "jsonwebtoken",
    "lodash",
    "mercurius",
    "nexus",
    "nexus-prisma",
  ],
})
  .then(() => {
    console.log("build complete");
  })
  .catch(() => process.exit(1));

// glob(path.resolve(__dirname, "../src/**/*.ts"), function (err, entryPoints) {
//   // files is an array of filenames.
//   // If the `nonull` option is set, and nothing
//   // was found, then files is ["**/*.js"]
//   // err is an error object or null.

//   if (err) throw err;

//   build({
//     entryPoints,
//     bundle: false,
//     // write: false,
//     outdir: path.resolve(__dirname, "../build"),
//     platform: "node",
//     format: "cjs",
//     sourcemap: "inline",
//     // external: [
//     //   "@prisma/client",
//     //   "bcrypt",
//     //   "cookie",
//     //   "date-fns",
//     //   "fastify",
//     //   "fastify-plugin",
//     //   "graphql",
//     //   "graphql-scalars",
//     //   "ioredis",
//     //   "jsonwebtoken",
//     //   "lodash",
//     //   "mercurius",
//     //   "nexus",
//     //   "nexus-prisma",
//     // ],
//   })
//     .then(() => {
//       console.log("build complete");
//     })
//     .catch(() => process.exit(1));
// });
