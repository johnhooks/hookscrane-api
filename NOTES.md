## Stack

- [Fastify](https://www.fastify.io)
- [Mercurius](https://mercurius.dev)
- [Prisma](https://www.prisma.io)
- [Nexus](https://nexusjs.org)

### Examples

- [Nexus Example with Prisma](https://github.com/graphql-nexus/nexus/tree/main/examples/with-prisma)
- [GraphQL Server with Fastify, Mercurius, Prisma, and Nexus Example](https://github.com/2color/fastify-graphql-nexus-prisma)
- [Integrating Nexus with Mercurius](https://mercurius.dev/#/docs/integrations/nexus)

## Postgres

- `\x` show expanded rows
- `\c {DATABASE_NAME}` connect to database named DATABASE_NAME
- `\dt` list tables
- Use single quotes for strings `WHERE "callSign" = 'hooky'`
- Use double quotes around column names `"User"."callSign"`

```sql
-- Delete complete data from an existing table
TRUNCATE TABLE table_name;
```

```sql
-- Update Roles to Racer and Super Admin
update "public"."User" set roles = 65664 where "User"."callSign" = 'hooky';
```

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

## DNS

- [ ] - [Managing DNS records in Cloudflare](https://support.cloudflare.com/hc/en-us/articles/360019093151-Managing-DNS-records-in-Cloudflare)
- [ ] - [Domains and DNS](https://docs.digitalocean.com/products/networking/dns/)

## date-fns

- [ ] - [Using time zones](https://date-fns.org/v2.22.1/docs/Time-Zones)

## Reading

- [ ] - [Prisma's Data Guide](https://www.prisma.io/dataguide/)
