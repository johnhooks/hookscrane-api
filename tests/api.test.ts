import { createMercuriusTestClient } from "mercurius-integration-testing";

import { createServer } from "server/server";

describe("api endpoints", () => {
  const server = createServer({ logger: false });
  const client = createMercuriusTestClient(server);

  afterAll(async () => {
    await server.close();
  });

  test("status endpoint returns 200", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
  });

  test("graphql endpoint return 200", async () => {
    const query = `
      query {
        status {
          up
        }
      }
    `;

    const response = await server.inject({
      method: "POST",
      url: "graphql",
      payload: {
        query,
      },
    });

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({ data: { status: { up: true } } });
  });

  // Example using the mercurius testing client
  test("graphql query status return 200", () => {
    client
      .query(
        `
          query {
            status {
              up
            }
          }
        `
      )
      .then(response => {
        expect(response).toEqual({ data: { status: { up: true } } });
      });
  });
});
