## Stack

- [Fastify](https://www.fastify.io)
- [Mercurius](https://mercurius.dev)
- [Prisma](https://www.prisma.io)
- [Nexus](https://nexusjs.org)

### Examples

- [Nexus Example with Prisma](https://github.com/graphql-nexus/nexus/tree/main/examples/with-prisma)
- [GraphQL Server with Fastify, Mercurius, Prisma, and Nexus Example](https://github.com/2color/fastify-graphql-nexus-prisma)
- [Integrating Nexus with Mercurius](https://mercurius.dev/#/docs/integrations/nexus)

## GraphQL

### Reading

- [Explaining GraphQL Connections](https://www.apollographql.com/blog/graphql/explaining-graphql-connections/)

## Dev and Start Scripts using `typescript-transform-paths`

- `node -r typescript-transform-paths/register build/app/main.js`
- `npx ts-node -r typescript-transform-paths/register --transpile-only src/app/main.ts`
- `npx ts-node -r tsconfig-paths/register build/app/main.js`
- `npx ts-node -r tsconfig-paths/register src/app/main.ts`

### watch

- `npx ts-node-dev --respawn -r typescript-transform-paths/register --transpile-only src/app/main.ts`

## TODO

- [x] - Move `src/server/schema.ts` into it's own project folder
- [x] - Split `src/schema/schema.ts` into a separate files
- [ ] - Read [Writing your first schema](https://nexusjs.org/docs/getting-started/tutorial/chapter-writing-your-first-schema/)
- [x] - Start modeling the graphql schema for inspections
- [ ] - Set and get session data with redis for authentication
- [x] - Clean up the removal of tsconfig.json paths
